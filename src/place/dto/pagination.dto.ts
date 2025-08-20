import { ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsPositive, Max, Min } from "class-validator"


export class PaginationDto {

    @ApiPropertyOptional({ description: 'Número da página atual', default: 1 })
    @IsNumber()
    @IsOptional()
    @IsPositive()
    @Min(1)
    @Type(() => Number)
    page: number

    @ApiPropertyOptional({ description: 'Quantidade de itens por página', default: 10 })
    @IsNumber()
    @IsOptional()
    @IsPositive()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    limit: number
}