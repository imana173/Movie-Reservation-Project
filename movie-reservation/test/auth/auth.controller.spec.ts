import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import { LoginUserDto } from '../../src/users/dto/login-user.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue({ message: 'Inscription réussie' }),
            login: jest.fn().mockResolvedValue({ access_token: 'FAKE_JWT_TOKEN' }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authController.register(createUserDto);

      expect(result).toEqual({ message: 'Inscription réussie' });
      expect(authService.register).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {
    it('should return a JWT token when login is successful', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authController.login(loginUserDto);

      expect(result).toEqual({ access_token: 'FAKE_JWT_TOKEN' });
      expect(authService.login).toHaveBeenCalledWith(loginUserDto);
    });
  });
});
