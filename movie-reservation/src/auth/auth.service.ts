import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  
  async register(createUserDto: CreateUserDto) {
    const users = await this.userRepository.find(); 
    for (const user of users) {
      if (user.email === createUserDto.email) {
        throw new UnauthorizedException('Email déjà utilisé');
    
      }
    }
  
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    await this.userRepository.save({ email: createUserDto.email, password: hashedPassword });
  
    return { message: 'Inscription réussie' };
  }
  

  
  async login(loginUserDto: LoginUserDto) {
    const users = await this.userRepository.find(); 
  
    let userFound: User | null = null; 
    for (const user of users) {
      if (user.email === loginUserDto.email) {
        userFound = user;
        break;
      }
    }
  
    if (!userFound) {
        throw new UnauthorizedException('Identifiants invalides');
    }
  
    const isValid = await bcrypt.compare(loginUserDto.password, userFound.password);
    if (!isValid) {
        throw new UnauthorizedException('Identifiants invalides');
    }
  console.log('Utilisateur authentifié:', { id: userFound.id, email: userFound.email });
  const token = this.jwtService.sign({ id: userFound.id, email: userFound.email });
  return { access_token: token };
  }
  
  
  
}
