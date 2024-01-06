import Joi from 'joi';
import { compare, hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';

import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
            private userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
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

        const access_token = this.getAccessToken(payload);
        const refresh_token_token = this.getAccessToken(payload);

        return {
          "message": "로그인에 성공했습니다.",
          "success": true,
          "data":{access_token,refresh_token_token}
        };
      }

      getAccessToken(payload:any){
        return this.jwtService.sign(payload,
          { 
            secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
          });
      }

      async getetRefreshToken(payload:any){
        return this.jwtService.sign(payload,{
            secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
          })
      }
      
      async verifyAccessToken(accessToken: string) {
        try {
            const payload = await this.jwtService.verify(accessToken);

            console.log(payload);

            return { success: true, id: payload.id };
        } catch (error) {
            const payload = await this.jwtService.verify(accessToken, {
                ignoreExpiration: true,
            });

            return { success: false, message: error.message, id: payload.id };
        }
    }

    async verifyRefreshToken(refreshToken: string) {
        try {
            const payload = await this.jwtService.verify(refreshToken);

            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
      

      async findByEmail(email: string) {
        return await this.userRepository.findOneBy({ email });
      }

      async validateUser({ email, password }: SignInDto) {
        const user = await this.userRepository.findOne({
          where: { email },
          select: { id: true, password: true },
        });
        const isPasswordMatched = bcrypt.compareSync(
          password,
          user?.password ?? '',
        );
    
        if (!user || !isPasswordMatched) {
          return null;
        }
    
        return { id: user.id };
      }
}
