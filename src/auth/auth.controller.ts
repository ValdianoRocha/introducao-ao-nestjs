import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { ApiBody, ApiConflictResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { loginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response';
import { GoogleService } from './google-auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleService: GoogleService
  ) { }

  @Post('register')
  @ApiBody({ type: RegisterUserDto })
  @ApiCreatedResponse({
    description: 'Usuario registrado com sucesso!'
  })
  @ApiConflictResponse({
    description: 'Email já em uso!'
  })
  async registerUser(@Body() createAuthDto: RegisterUserDto) {
    return this.authService.registerUser(createAuthDto);
  }


  @Post('login')
  @ApiBody({ type: loginDto })
  login(@Body() credentials: loginDto): Promise<LoginResponseDto> {
    return this.authService.login(credentials)
  }

  @Post('google')
  async loginWithGoogle(
    @Body() Body: { idToken: string }
  ) {
    const access_token = await this.googleService.veryfy(
      Body.idToken
    )

    return { access_token }
  }

}
