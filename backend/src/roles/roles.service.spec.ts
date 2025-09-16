// roles.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { RoleServices } from './roles.service';
import { Roles } from './entities/roles.entity';
import { User } from '../users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { RoleErrors } from './constants/roles.errors';
import { DefaultRolePermissions } from './dto/permissions.default';

describe('RoleServices', () => {
  let service: RoleServices;
  let mockRolesRepo: any;
  let mockUserRepo: any;

  beforeEach(async () => {
    mockRolesRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };
    mockUserRepo = {}; // not used in current service but mocked for injection

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleServices,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: getRepositoryToken(Roles), useValue: mockRolesRepo },
      ],
    }).compile();

    service = module.get<RoleServices>(RoleServices);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRole', () => {
    it('should create and save a role with given permissions', async () => {
      const dto = { role: 'Admin', permissions: ['read', 'write'] };
      const createdRole = { ...dto };
      const savedRole = { id: '123', ...dto };

      mockRolesRepo.create.mockReturnValue(createdRole);
      mockRolesRepo.save.mockResolvedValue(savedRole);

      const result = await service.createRole(dto);

      expect(mockRolesRepo.create).toHaveBeenCalledWith({
        role: dto.role,
        permissions: dto.permissions,
      });
      expect(mockRolesRepo.save).toHaveBeenCalledWith(createdRole);
      expect(result).toEqual(savedRole);
    });

    it('should create a role with default permissions if none provided', async () => {
      const dto = { role: 'User' };
      const defaultPermissions = DefaultRolePermissions['User'];
      const createdRole = { role: 'User', permissions: defaultPermissions };
      const savedRole = { id: '456', ...createdRole };

      mockRolesRepo.create.mockReturnValue(createdRole);
      mockRolesRepo.save.mockResolvedValue(savedRole);

      const result = await service.createRole(dto);

      expect(mockRolesRepo.create).toHaveBeenCalledWith({
        role: dto.role,
        permissions: defaultPermissions,
      });
      expect(result).toEqual(savedRole);
    });
  });

  describe('getRoleById', () => {
    it('should return a role when found', async () => {
      const role = { id: '123', role: 'Admin', permissions: [] };
      mockRolesRepo.findOne.mockResolvedValue(role);

      const result = await service.getRoleById('123');
      expect(mockRolesRepo.findOne).toHaveBeenCalledWith({ where: { id: '123' } });
      expect(result).toEqual({ role });
    });

    it('should throw NotFoundException when role not found', async () => {
      mockRolesRepo.findOne.mockResolvedValue(null);

      await expect(service.getRoleById('999')).rejects.toThrow(
        new NotFoundException(RoleErrors.ROLE_NOT_EXISTS),
      );
    });
  });

  describe('updateRoleById', () => {
    it('should update and save role permissions', async () => {
      const existingRole = { id: '123', permissions: [] };
      const dto = { permissions: ['read', 'write'] };
      const updatedRole = { ...existingRole, permissions: dto.permissions };

      mockRolesRepo.findOne.mockResolvedValue(existingRole);
      mockRolesRepo.save.mockResolvedValue(updatedRole);

      const result = await service.updateRoleById('123', dto);

      expect(mockRolesRepo.findOne).toHaveBeenCalledWith({ where: { id: '123' } });
      expect(mockRolesRepo.save).toHaveBeenCalledWith(updatedRole);
      expect(result).toEqual(updatedRole);
    });

    it('should throw NotFoundException if role does not exist', async () => {
      mockRolesRepo.findOne.mockResolvedValue(null);

      await expect(service.updateRoleById('999', { permissions: [] })).rejects.toThrow(
        new NotFoundException(RoleErrors.ROLE_NOT_EXISTS),
      );
    });
  });
});
