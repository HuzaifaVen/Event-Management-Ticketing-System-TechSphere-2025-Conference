import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Roles } from 'src/roles/entities/roles.entity';
import { UserRole } from 'src/roles/enums/userRoles.dto';
import { DefaultRolePermissions } from 'src/roles/dto/permissions.default';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Roles)
    private readonly rolesRepo: Repository<Roles>,
  ) { }

  async createUser(dto: CreateUserDto) {
    const role = this.rolesRepo.create({
      role: UserRole.CUSTOMER,
      permissions: DefaultRolePermissions[UserRole.CUSTOMER],
    });
    const savedRole = await this.rolesRepo.save(role);

    const user = this.usersRepository.create({
      ...dto,
      role: savedRole,
    });
    await this.usersRepository.save(user);

    return user;
  }


  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);

    return await this.usersRepository.save(user);
  }

}
