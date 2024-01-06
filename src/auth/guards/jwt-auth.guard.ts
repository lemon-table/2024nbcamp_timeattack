import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExtractJwt } from 'passport-jwt';
import { JwtRefreshAuthGuard } from './jwt-refresh-auth.guard';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
                private readonly jwtService: JwtService,
                private readonly userService : UserService
            ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    console.log(`request : ${request}`)

    // 헤더에서 Bearer 토큰 추출
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    if (!token) {
      throw new UnauthorizedException('토큰이 제공되지 않았습니다.');
    }
    console.log(`token : ${token}`);

    try {
      // 토큰 검증
      const decoded = this.jwtService.verify(token);
      request.user = decoded;
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        // Access Token이 만료된 경우 Refresh Token 검증 시도
        const refreshGuard = new JwtRefreshAuthGuard(this.jwtService);
        return refreshGuard.canActivate(context);
      }
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }
}
