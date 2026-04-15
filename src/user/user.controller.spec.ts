import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDocument } from './entities/UserEntity';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUser = {
    _id: 'user-id-123',
    email: 'test@example.com',
    name: 'Test User',
  };

  const mockUserService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const users = [mockUser];
      mockUserService.findAll.mockResolvedValue(users);

      const result = await controller.getUsers();

      expect(result).toEqual(users);
      expect(mockUserService.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no users', async () => {
      mockUserService.findAll.mockResolvedValue([]);

      const result = await controller.getUsers();

      expect(result).toEqual([]);
    });
  });
});