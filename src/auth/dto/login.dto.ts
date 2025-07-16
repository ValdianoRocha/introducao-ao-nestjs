import { IsEmail, IsString } from "class-validator";



export class loginDto {
    @IsEmail({}, {message: 'O email precisa ser valido'})
    email: string

    @IsString({message: 'A senha precisa conter letras!'})
    password: string
}
