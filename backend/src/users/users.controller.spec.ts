import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const mockUsersService = {
      create: jest.fn(),
      findUserRole: jest.fn(),
      findUser: jest.fn(),
      blockUser: jest.fn(),
      unBlockUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should call UsersService.create with correct data', async () => {
      const dto = { name: 'John', email: 'john@example.com', password: 'pass123' };
      const mockUser = { id: 'u1', ...dto };
      (service.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findUserRole', () => {
    it('should call UsersService.findUserRole with correct id', async () => {
      const id = 'user-123';
      const mockRole = { id, role: 'admin' };
      (service.findUserRole as jest.Mock).mockResolvedValue(mockRole);

      const result = await controller.findUserRole(id);
      expect(service.findUserRole).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockRole);
    });
  });

  describe('findUser', () => {
    it('should call UsersService.findUser with correct id', async () => {
      const id = 'user-456';
      const mockUser = { id, name: 'Jane' };
      (service.findUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await controller.findUser(id);
      expect(service.findUser).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockUser);
    });
  });

  describe('blockUser', () => {
    it('should call UsersService.blockUser with correct id', async () => {
      const id = 'user-789';
      const mockResponse = { message: 'User blocked successfully' };
      (service.blockUser as jest.Mock).mockResolvedValue(mockResponse);

      const result = await controller.blockUser(id);
      expect(service.blockUser).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('unblockUser', () => {
    it('should call UsersService.unBlockUser with correct id', async () => {
      const id = 'user-101';
      const mockResponse = { message: 'User unblocked successfully' };
      (service.unBlockUser as jest.Mock).mockResolvedValue(mockResponse);

      const result = await controller.unblockUser(id);
      expect(service.unBlockUser).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockResponse);
    });
  });
});
