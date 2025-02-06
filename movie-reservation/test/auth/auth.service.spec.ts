import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/users/user.entity';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('FAKE_JWT_TOKEN'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const createUserDto = { email: 'test@example.com', password: 'password123' };
      jest.spyOn(userRepository, 'find').mockResolvedValue([]);
      jest.spyOn(userRepository, 'save').mockResolvedValue({
        email: createUserDto.email,
        password: 'hashed_password',
      } as User);
      
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed_password');

      const result = await service.register(createUserDto);

      expect(result).toEqual({ message: 'Inscription réussie' });
      expect(userRepository.save).toHaveBeenCalledWith({
        email: createUserDto.email,
        password: 'hashed_password',
      });
    });

    it('should throw UnauthorizedException if email is already used', async () => {
      const createUserDto = { email: 'test@example.com', password: 'password123' };
      jest.spyOn(userRepository, 'find').mockResolvedValue([{ email: 'test@example.com' } as User]);

      await expect(service.register(createUserDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return a JWT token when credentials are correct', async () => {
      const loginUserDto = { email: 'test@example.com', password: 'password123' };
      const user = { id: 1, email: 'test@example.com', password: 'hashed_password' } as User;
      jest.spyOn(userRepository, 'find').mockResolvedValue([user]);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.login(loginUserDto);

      expect(result).toEqual({ access_token: 'FAKE_JWT_TOKEN' });
      expect(jwtService.sign).toHaveBeenCalledWith({ id: user.id, email: user.email });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const loginUserDto = { email: 'test@example.com', password: 'password123' };
      jest.spyOn(userRepository, 'find').mockResolvedValue([]);

      await expect(service.login(loginUserDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const loginUserDto = { email: 'test@example.com', password: 'password123' };
      const user = { id: 1, email: 'test@example.com', password: 'hashed_password' } as User;
      jest.spyOn(userRepository, 'find').mockResolvedValue([user]);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.login(loginUserDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
