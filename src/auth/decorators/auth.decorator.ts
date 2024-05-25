import { UseGuards, applyDecorators } from '@nestjs/common';
import { RolesProtected } from './roles-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';

export function Auth(...roles: string[]) {

  return applyDecorators(
    RolesProtected(...roles),
    UseGuards( AuthGuard(), UserRoleGuard),
  );

}