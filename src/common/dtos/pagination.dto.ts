import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min, } from "class-validator";


export class PaginationDto {
    @IsOptional()
    @Type(() => Number)
    offset: number = 0;

    @IsOptional()
    @IsPositive()
    @Min(0)
    @Type(() => Number)
    limit: number = 20;
}