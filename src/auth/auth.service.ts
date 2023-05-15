import {
  BadRequestException,
  Headers,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from './entities/user.entity';
import { ErrorDbPostgres } from 'src/products/entities';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { use } from 'passport';
import { fileNamer } from '../files/helpers/fileNemar.helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);

      return {
        uid: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.roles,
        active: user.isActive,
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  private getJwtoken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtoken({ id: user.id }),
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, email: true, password: true },
    });

    if (!user) throw new UnauthorizedException('Credentials not found');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials not found');

    return { ...user, token: this.getJwtoken({ id: user.id }) };
  }

  private handleDBErrors(error: ErrorDbPostgres): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException('Please check the server logs');
  }
}
