import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  sayHello(): string {
    return 'Hello!'
  }
}
