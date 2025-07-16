import { ApiProperty } from "@nestjs/swagger"
import { PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Min, MinLength } from "class-validator";

export class createUserDto {
    @ApiProperty({
        example: 'valdiano rocha',
        description: 'Nome completo do usuario'
    })
    @IsNotEmpty({message: 'nome é obrigatorio'})        //não ceita vazio nunca 
    @MinLength(3,{message: 'minimo de 3 caractere'})    // minimo de caractere
    name: string

    @ApiProperty({
        example: 'valdianoDev@gmail.com',
        description: 'Email do usuario'
    })
    @IsEmail({},{message: 'email invalido'})            // validar email
    email: string

    password: string
}


export class UpdateUserDto extends PartialType(createUserDto) { }