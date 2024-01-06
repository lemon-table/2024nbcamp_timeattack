import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signUp(@Body() signupDto: SignUpDto) {
    return await this.userService.signUp(signupDto);
  }

  @Post('signin')
  async signIn(@Body() signinDto: SignInDto) {
    return await this.userService.signIn(signinDto.email, signinDto.password);
  }
}
