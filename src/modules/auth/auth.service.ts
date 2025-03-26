import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDTO } from './dtos';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IEnvs } from 'src/common/interfaces';
import { log } from 'console';

@Injectable()
export class AuthService {
  private readonly id = this.configService.get('USER_ID');
  private readonly role = this.configService.get('USER_ROLE');

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<IEnvs>,
  ) {}

  login(dto: LoginDTO): { accessToken: string; refreshToken: string } {
    const user = this.configService.get('USER');
    const password = this.configService.get('PASSWORD');
    log('role ==>', this.role);

    if (dto.username !== user || dto.password !== password) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const accessToken = this.jwtService.sign(
      { id: this.id, role: this.role },
      {
        secret: this.configService.get('ACCESSTOKEN_SECRET'),
        expiresIn: this.configService.get('ACCESSTOKEN_EXPIRATION'),
      },
    );

    const refreshToken = this.jwtService.sign(
      {},
      {
        secret: this.configService.get('REFRESHTOKEN_SECRET'),
        expiresIn: this.configService.get('REFRESHTOKEN_EXPIRATION'),
      },
    );

    return { accessToken, refreshToken };
  }

  refreshToken(): { accessToken: string } {
    const accessToken = this.jwtService.sign(
      { id: this.id, role: this.role },
      {
        secret: this.configService.get('ACCESSTOKEN_SECRET'),
        expiresIn: this.configService.get('ACCESSTOKEN_EXPIRATION'),
      },
    );

    return { accessToken };
  }
}
