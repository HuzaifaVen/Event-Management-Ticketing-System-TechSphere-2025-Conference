import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
<<<<<<< HEAD
import { Roles } from '../roles/entities/roles.entity';
import { UserRole } from '../roles/enums/userRoles.dto';
import { DefaultRolePermissions } from '../roles/dto/permissions.default';
import { AuthErrors } from '../auth/constants/auth.errors';
=======
import { Roles } from 'src/roles/entities/roles.entity';
import { UserRole } from 'src/roles/enums/userRoles.dto';
import { DefaultRolePermissions } from 'src/roles/dto/permissions.default';
import { AuthErrors } from 'src/auth/constants/auth.errors';
>>>>>>> ac44b6d7b15ae1e86bae229d45c3aabb71f96157
import { UserMessages } from './constants/user.messages';
import { UserErrors } from './constants/user.errors';
import { RoleServices } from '../roles/roles.service';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Roles)
    private readonly rolesRepo: Repository<Roles>,
    private readonly rolesService: RoleServices
  ) { }

  async createUser(dto: CreateUserDto) {
    const role = this.rolesRepo.create({
      role: UserRole.ATTENDEE,
      permissions: DefaultRolePermissions[UserRole.ATTENDEE],
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
    const user = await this.usersRepository.create(createUserDto);

    return await this.usersRepository.save(user);
  }

  async blockUser(id:string){
    const user = await this.usersRepository.findOne({where:{id}})
    if(!user) throw new NotFoundException(AuthErrors.USER_NOT_FOUND)
    if(user.isBlocked) throw new BadRequestException(UserErrors.USER_ALREADY_BLOCKED)

    user.isBlocked = true;
    await this.usersRepository.save(user);

    return {message: UserMessages.USER_BLOCKED_SUCCESS }
  }

  async unBlockUser(id: string){
    const user = await this.usersRepository.findOne({where:{id}})
    if(!user) throw new NotFoundException(AuthErrors.USER_NOT_FOUND)
    if(user.isBlocked === false) throw new BadRequestException(UserErrors.USER_ALREADY_UNBLOCKED)
    user.isBlocked = false; 
    await this.usersRepository.save(user);

    return {message: UserMessages.USER_UNBLOCKED_SUCCESS}
  }

  async findUser(id:string){
    const user = await this.usersRepository.findOne({where:{id}})
    if(!user) throw new NotFoundException(AuthErrors.USER_NOT_FOUND)
    if(user.isBlocked) throw new NotFoundException(AuthErrors.USER_NOT_EXIST)

    return user;
  }

  async findUserRole(id:string){
    const user = await this.findUser(id);
    const role = await this.rolesService.getRoleById(user.roleId)
    return role;
  }


}
