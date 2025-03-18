import { Resolver, Mutation, Args, ObjectType, Field } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@ObjectType()
class LoginResponse {
  @Field()
  access_token: string;
}

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<LoginResponse> {
    const user = await this.authService.validateUser(email, password);
    if (!user) throw new Error('Invalid credentials');

    return this.authService.login(user);
  }
}
