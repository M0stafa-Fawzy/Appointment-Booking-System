import { IsDateString, IsInt, IsMilitaryTime, IsOptional, Min } from "class-validator"
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateSlotDto {
    @ApiPropertyOptional({ example: '2025-04-15' })
    @IsOptional()
    @IsDateString()
    date: string

    @ApiPropertyOptional({ example: '09:00' })
    @IsOptional()
    @IsMilitaryTime()
    startTime: string

    @ApiPropertyOptional({ example: '09:30' })
    @IsOptional()
    @IsMilitaryTime()
    endTime: string

    @ApiPropertyOptional({ example: 30 })
    @IsOptional()
    @IsInt()
    @Min(1)
    duration: number
}
