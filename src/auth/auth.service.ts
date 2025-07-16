import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt'
import { loginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService
  ) { }

  async registerUser(userData: RegisterUserDto) {
    const userExists = await this.prisma.user.findUnique({  //verificar se o usuario ja existe no banco de dados 
      where: { email: userData.email }
    })

    if (userExists) {
      throw new ConflictException('Email já esta em uso!')  //mensagem de erro se o usuario existe
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10)  //cryptografando a senha 

    const newUser = await this.prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword
      },
      select: {  // retornar o que ta aqui
        id: true,
        name: true,
        email: true,
        role: true
      }
    })

    return newUser
  }

  async validadeUser(email: string, password: string) {

    const user = await this.prisma.user.findUnique({
      where: { email }
    })
    if (!user) throw new UnauthorizedException('Credenciais Invalidas!')

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new UnauthorizedException('Credenciais Invalidas!')

    return user

  }

  async login(credentials: loginDto) {
    const user = await this.validadeUser(
      credentials.email,
      credentials.password
    )

    const payload = {  // o que eu vou colocar de informação no tokem do ususario
      userId: user.id,
      email: user.email,
      role: user.role
    }

    return {
      access_token: this.jwt.sign(payload)
    }
  }

}
