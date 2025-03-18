import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import * as bcrypt from 'bcrypt';
import { handleDatabaseError } from 'src/utils/exception.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
      
      const user = this.usersRepository.create({
        ...createUserInput,
        password: hashedPassword,
      });

      return await this.usersRepository.save(user);
    } catch (error) {
      handleDatabaseError(error);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.usersRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users.');
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      return await this.usersRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
  }

  async update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
    try {
      const user = await this.findOne(id);

      if (updateUserInput.password) {
        updateUserInput.password = await bcrypt.hash(updateUserInput.password, 10);
      }

      await this.usersRepository.update(id, updateUserInput);
      return this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      handleDatabaseError(error);
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneOrFail({ where: { email } });
    } catch (error) {
      throw new NotFoundException(`User with email ${email} not found.`);
    }
  }
}