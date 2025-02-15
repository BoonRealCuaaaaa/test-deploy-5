import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/shared/constants/roles';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
