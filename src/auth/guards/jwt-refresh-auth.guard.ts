import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtRefreshAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // 쿠키에서 Refresh Token 추출
    const refreshToken = request.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh Token이 제공되지 않았습니다.');
    }

    try {
      // Refresh Token 검증
      const decoded = this.jwtService.verify(refreshToken);
      request.user = decoded;

      // 새로운 Access Token 발급
      const newAccessToken = this.jwtService.sign({
        email: decoded.email, // 이메일 또는 다른 사용자 정보
        sub: decoded.sub,
      });

      // 발급된 Access Token을 Response 헤더에 설정
      context.switchToHttp().getResponse().header('Authorization', `Bearer ${newAccessToken}`);
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 Refresh Token입니다.');
    }
  }
}
