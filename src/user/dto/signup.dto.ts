import { IsEmail, IsNotEmpty, IsString, IsMobilePhone } from 'class-validator';

export class SignUpDto {

  /**
   * 이메일
   * @example "user1@sparta.com"
   */
  @IsEmail({},{message:"이메일 형식에 맞지 않습니다."})
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  /**
   * 비밀번호
   * @example "password1234"
   */
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;

  /**
   * 비밀번호 확인
   * @example "password1234"
   */
  @IsString()
  @IsNotEmpty({ message: '비밀번호 확인란을 입력해주세요.' })
  confirmPassword: string;

  /**
   * 닉네임
   * @example "user1"
   */
  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  nickname: string;

  /**
   * 전화번호
   * @example "01025856485"
   */
  @IsMobilePhone()
  @IsNotEmpty({ message: '전화번호를 입력해주세요.' })
  phone: string;
}