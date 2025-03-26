import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthStrategy, RefreshStrategy } from 'src/common/strategies';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, JwtService, AuthStrategy, RefreshStrategy],
})
export class AuthModule {}
