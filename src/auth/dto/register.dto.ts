import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, MinLength } from "class-validator"


export class RegisterUserDto {

    @ApiProperty({
        description: 'nome do usuario.',
        example: 'exemplo da silva'
    })
    @IsString({message: 'Nome e sobrenome'})
    name: string

    @ApiProperty({
        description: 'Email do Usuario.',
        example: 'exempli@gmail.com'
    })
    @IsEmail({},{message: 'Email tem que ser valido'})
    email: string

    @ApiProperty({
        description: 'Senha do Usuario.',
        example: 'senha123'
    })
    @IsString()
    @MinLength(6,{message: 'Minimo de 6 caracteres'})
    password: string

}