import { HttpException, HttpStatus } from '@nestjs/common';

export function handleDatabaseError(error: any): never {
  if (error.code === '23505') {
    throw new HttpException(
      {
        statusCode: HttpStatus.CONFLICT,
        message: 'Duplicate entry: A record with this value already exists.',
        error: 'Conflict',
      },
      HttpStatus.CONFLICT,
    );
  }

  if (error.code === '22P02') {
    throw new HttpException(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid input format.',
        error: 'Bad Request',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  throw new HttpException(
    {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Something went wrong. Please try again later.',
      error: 'Internal Server Error',
    },
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
}
