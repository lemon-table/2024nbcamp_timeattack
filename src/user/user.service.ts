import { compare, hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';

import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
            private userRepository: Repository<User>,
        private readonly jwtService: JwtService,
      ) {}

      async signUp(signupDto:SignUpDto) {

        if(signupDto.password.length < 6){
            throw new BadRequestException(`비밀번호는 최소 6자리 이상이어야 합니다.`);
        }
    
        if (signupDto.password !== signupDto.confirmPassword){
            throw new BadRequestException('비밀번호와 비밀번호 확인란이 일치하지 않습니다.');
        }
    
        const existingUser = await this.findByEmail(signupDto.email);
        if (existingUser) {
          throw new ConflictException(
            '이미 해당 이메일로 가입된 사용자가 있습니다!',
          );
        }
    
        const hashedPassword = await hash(signupDto.password, 10);
        await this.userRepository.save({
          email:signupDto.email,
          password: hashedPassword,
          nickname:signupDto.nickname,
          phone:signupDto.phone
        });
    
        return{
          "message": "회원가입에 성공했습니다.",
          "success": true,
          "data":{
                  email:signupDto.email,
                  nickname:signupDto.nickname,
                  phone:signupDto.phone}
        }
      }
    
      async signIn(email: string, password: string) {
        const user = await this.userRepository.findOne({
          select: ['id', 'email', 'password'],
          where: { email },
        });
    
        // 이메일 또는 패스워드로 오류 조건 변경
        if (!user || !(await compare(password, user.password))) {
          throw new UnauthorizedException('이메일 또는 패스워드를 확인해주세요.');
        }
    
        const payload = { email, sub: user.id };
        return {
          "message": "로그인에 성공했습니다.",
          "success": true,
          "data":{access_token: this.jwtService.sign(payload,{ expiresIn: '10m' })}
        };
      }

      async findByEmail(email: string) {
        return await this.userRepository.findOneBy({ email });
      }
}
