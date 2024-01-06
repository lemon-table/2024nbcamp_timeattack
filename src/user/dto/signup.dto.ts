import { IsEmail, IsNotEmpty, IsString, IsMobilePhone } from 'class-validator';

export class SignUpDto {
  @IsEmail({},{message:"이메일 형식에 맞지 않습니다."})
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호 확인란을 입력해주세요.' })
  confirmPassword: string;

  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  nickname: string;

  @IsMobilePhone()
  @IsNotEmpty({ message: '전화번호를 입력해주세요.' })
  phone: string;
}