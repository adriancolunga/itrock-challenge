import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from '.';
import { RolesGuard } from './roles.guard';

export enum Roles {
  OWNER = 'owner',
  ADMIN = 'admin',
}

export const AuthApi = (...roles: Roles[]) =>
  applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthenticationGuard, RolesGuard),
  );
