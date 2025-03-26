import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEnvs } from '../interfaces';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService<IEnvs>) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const headerApiKey = request.headers['x-api-key'];
    const storedApiKey = this.configService.get('API_KEY');

    if (headerApiKey !== storedApiKey)
      throw new UnauthorizedException('Invalid api key');
    return true;
  }
}
