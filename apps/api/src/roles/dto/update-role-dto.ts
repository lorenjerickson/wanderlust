import { CreateRoleDto } from './create-roles.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
