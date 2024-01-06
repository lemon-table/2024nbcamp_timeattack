import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {

   /**
   * 이메일
   * @example "user1@sparta.com"
   */
  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  /**
   * 비밀번호
   * @example "password1234"
   */
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;
}