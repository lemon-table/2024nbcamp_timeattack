import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from 'src/auth/guards/jwt-refresh-auth.guard';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

  /**
   * 회원가입
   * @param signupDto 
   * @returns 
   */
  @Post('signup')
  async signUp(@Body() signupDto: SignUpDto) {
    return await this.userService.signUp(signupDto);
  }

  /**
   * 로그인
   * @param signinDto 
   * @returns 
   */
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local'))
  @Post('signin')
  async signIn(@Body() signinDto: SignInDto) {
    return await this.userService.signIn(signinDto.email, signinDto.password);
  }
}
