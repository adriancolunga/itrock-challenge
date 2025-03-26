import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos';
import { Throttle } from '@nestjs/throttler';
import { RefreshGuard } from 'src/common/guards';
import { unauthorizedResponse } from 'src/common/api-unauthorized-response';

@Controller('auth')
@ApiTags('auth')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Unauthorized Request',
  example: unauthorizedResponse,
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Throttle({ default: { limit: 3, ttl: 5 * 60 * 1000 } })
  @ApiOkResponse({
    description: 'OK',
    example: {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  })
  login(@Body() dto: LoginDTO): { accessToken: string; refreshToken: string } {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @UseGuards(RefreshGuard)
  @ApiOkResponse({
    description: 'OK',
    example: { accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
  })
  refreshToken(): { accessToken: string } {
    return this.authService.refreshToken();
  }
}
