// roles.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RoleServices } from './roles.service';
import { UpdateRoleDto } from './dto/update-roles.dto';
import { CreateRoleDto } from './dto/roles.dto';
import { UserRole } from './enums/userRoles.dto';

describe('RolesController', () => {
  let controller: RolesController;
  let service: RoleServices;

  beforeEach(async () => {
    const mockRoleServices = {
      getRoleById: jest.fn(),
      updateRoleById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        { provide: RoleServices, useValue: mockRoleServices },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get<RoleServices>(RoleServices);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findRoleById', () => {
    it('should return a role when found', async () => {
      const mockRole = { id: '123', name: 'Admin' };
      (service.getRoleById as jest.Mock).mockResolvedValue(mockRole);

      const result = await controller.findRoleById('123');
      expect(result).toEqual(mockRole);
      expect(service.getRoleById).toHaveBeenCalledWith('123');
    });

    it('should throw if role not found', async () => {
      (service.getRoleById as jest.Mock).mockRejectedValue(new Error('Role not found'));
      await expect(controller.findRoleById('999')).rejects.toThrow('Role not found');
    });
  });

  describe('updateRoleById', () => {
    it('should update and return updated role', async () => {
      const dto: CreateRoleDto = { role: UserRole.ADMIN};
      const updatedRole = { id: '123', role: UserRole.ADMIN };

      (service.updateRoleById as jest.Mock).mockResolvedValue(updatedRole);

      const result = await controller.updateRoleById('123', dto);
      expect(result).toEqual(updatedRole);
      expect(service.updateRoleById).toHaveBeenCalledWith('123', dto);
    });

    it('should throw if role not found during update', async () => {
      (service.updateRoleById as jest.Mock).mockRejectedValue(new Error('Role not found'));

      await expect(controller.updateRoleById('999', { name: 'User' })).rejects.toThrow(
        'Role not found',
      );
    });
  });
});
