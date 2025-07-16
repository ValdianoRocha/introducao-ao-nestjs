import { ApiProperty } from "@nestjs/swagger"
import { placeType } from "@prisma/client"
import { Type } from "class-transformer"
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator"



export class CreatePlaceDto {

    @ApiProperty({ example: 'Casa de Massagem' })
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({ example: 'BAR' })
    @IsEnum(placeType)
    type: placeType

    @ApiProperty({ example: '(88) 99999-9999' })
    @IsString()
    phone: string

    @ApiProperty({ example: '-3,25897456' })
    @Type(()=> Number)
    @IsNumber()
    latitude: number

    @ApiProperty({ example: '-32,25897456' })
    @Type(()=> Number)
    @IsNumber()
    longitude: number
}
