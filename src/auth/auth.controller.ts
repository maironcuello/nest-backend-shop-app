import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IncomingHttpHeaders } from 'http';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards';
import { Auth, GetUser, GetRawHeaders, RoleProtected } from './decorators';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    // @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @GetRawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    // console.log(request);

    return {
      ok: true,
      message: 'Hello World Private',
      user,
      userEmail,
      rawHeaders,
      headers,
    };
  }

  @Get('private2')
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  testingPrivate2Route(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.user)
  testingPrivate3Route(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }
}
