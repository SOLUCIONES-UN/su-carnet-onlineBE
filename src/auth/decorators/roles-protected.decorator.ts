import { SetMetadata } from '@nestjs/common';

export const META_ROLES= 'roles';


export const RolesProtected = (...args: string[]) => {



    return SetMetadata(META_ROLES, args);
}
