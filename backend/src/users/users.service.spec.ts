import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Roles } from '../roles/entities/roles.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoleServices } from '../roles/roles.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRole } from '../roles/enums/userRoles.dto';
import { DefaultRolePermissions } from '../roles/dto/permissions.default';
import { AuthErrors } from '../auth/constants/auth.errors';
import { UserMessages } from './constants/user.messages';
import { UserErrors } from './constants/user.errors';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepo: jest.Mocked<Repository<User>>;
  let rolesRepo: jest.Mocked<Repository<Roles>>;
  let rolesService: jest.Mocked<RoleServices>;

  beforeEach(async () => {
    const usersRepoMock = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    const rolesRepoMock = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const rolesServiceMock = {
      getRoleById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: usersRepoMock },
        { provide: getRepositoryToken(Roles), useValue: rolesRepoMock },
        { provide: RoleServices, useValue: rolesServiceMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepo = module.get(getRepositoryToken(User));
    rolesRepo = module.get(getRepositoryToken(Roles));
    rolesService = module.get(RoleServices);
  });

  describe('createUser', () => {
    it('should create role and user successfully', async () => {
      const dto = { name: 'John', email: 'john@test.com', password: '123' };

      const mockRole = { id: 'role-1', role: UserRole.CUSTOMER };
      rolesRepo.create.mockReturnValue(mockRole as Roles);
      rolesRepo.save.mockResolvedValue(mockRole as Roles);

      const mockUser = { id: 'user-1', ...dto, role: mockRole };
      usersRepo.create.mockReturnValue(mockUser as User);
      usersRepo.save.mockResolvedValue(mockUser as User);

      const result = await service.createUser(dto);

      expect(rolesRepo.create).toHaveBeenCalledWith({
        role: UserRole.CUSTOMER,
        permissions: DefaultRolePermissions[UserRole.CUSTOMER],
      });
      expect(rolesRepo.save).toHaveBeenCalledWith(mockRole);
      expect(usersRepo.create).toHaveBeenCalledWith({ ...dto, role: mockRole });
      expect(usersRepo.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('should create and save user', async () => {
      const dto = { name: 'Jane', email: 'jane@test.com', password: 'abc' };
      const mockUser = { id: 'u2', ...dto };

      usersRepo.create.mockReturnValue(mockUser as User);
      usersRepo.save.mockResolvedValue(mockUser as User);

      const result = await service.create(dto);
      expect(usersRepo.create).toHaveBeenCalledWith(dto);
      expect(usersRepo.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('blockUser', () => {
    it('should block user successfully', async () => {
      const mockUser = { id: 'u3', isBlocked: false };
      usersRepo.findOne.mockResolvedValue(mockUser as User);
      usersRepo.save.mockResolvedValue({ ...mockUser, isBlocked: true } as User);

      const result = await service.blockUser('u3');

      expect(usersRepo.findOne).toHaveBeenCalledWith({ where: { id: 'u3' } });
      expect(usersRepo.save).toHaveBeenCalledWith({ ...mockUser, isBlocked: true });
      expect(result).toEqual({ message: UserMessages.USER_BLOCKED_SUCCESS });
    });

    it('should throw NotFoundException if user not found', async () => {
      usersRepo.findOne.mockResolvedValue(null);
      await expect(service.blockUser('missing')).rejects.toThrow(
        new NotFoundException(AuthErrors.USER_NOT_FOUND),
      );
    });

    it('should throw BadRequestException if already blocked', async () => {
      usersRepo.findOne.mockResolvedValue({ id: 'u3', isBlocked: true } as User);
      await expect(service.blockUser('u3')).rejects.toThrow(
        new BadRequestException(UserErrors.USER_ALREADY_BLOCKED),
      );
    });
  });

  describe('unBlockUser', () => {
    it('should unblock user successfully', async () => {
      const mockUser = { id: 'u4', isBlocked: true };
      usersRepo.findOne.mockResolvedValue(mockUser as User);
      usersRepo.save.mockResolvedValue({ ...mockUser, isBlocked: false } as User);

      const result = await service.unBlockUser('u4');
      expect(usersRepo.save).toHaveBeenCalledWith({ ...mockUser, isBlocked: false });
      expect(result).toEqual({ message: UserMessages.USER_UNBLOCKED_SUCCESS });
    });

    it('should throw NotFoundException if user not found', async () => {
      usersRepo.findOne.mockResolvedValue(null);
      await expect(service.unBlockUser('missing')).rejects.toThrow(
        new NotFoundException(AuthErrors.USER_NOT_FOUND),
      );
    });

    it('should throw BadRequestException if already unblocked', async () => {
      usersRepo.findOne.mockResolvedValue({ id: 'u4', isBlocked: false } as User);
      await expect(service.unBlockUser('u4')).rejects.toThrow(
        new BadRequestException(UserErrors.USER_ALREADY_UNBLOCKED),
      );
    });
  });

  describe('findUser', () => {
    it('should return user if exists and not blocked', async () => {
      const mockUser = { id: 'u5', isBlocked: false };
      usersRepo.findOne.mockResolvedValue(mockUser as User);

      const result = await service.findUser('u5');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      usersRepo.findOne.mockResolvedValue(null);
      await expect(service.findUser('missing')).rejects.toThrow(
        new NotFoundException(AuthErrors.USER_NOT_FOUND),
      );
    });

    it('should throw NotFoundException if user is blocked', async () => {
      usersRepo.findOne.mockResolvedValue({ id: 'u5', isBlocked: true } as User);
      await expect(service.findUser('u5')).rejects.toThrow(
        new NotFoundException(AuthErrors.USER_NOT_EXIST),
      );
    });
  });

  describe('findUserRole', () => {
    it('should return role from rolesService', async () => {
      const mockUser = { id: 'u6', isBlocked: false, roleId: 'r1' };
      const mockRole = { id: 'r1', role: UserRole.CUSTOMER };
      jest.spyOn(service, 'findUser').mockResolvedValue(mockUser as User);
      rolesService.getRoleById.mockResolvedValue(mockRole as Roles);

      const result = await service.findUserRole('u6');
      expect(service.findUser).toHaveBeenCalledWith('u6');
      expect(rolesService.getRoleById).toHaveBeenCalledWith('r1');
      expect(result).toEqual(mockRole);
    });
  });
});
