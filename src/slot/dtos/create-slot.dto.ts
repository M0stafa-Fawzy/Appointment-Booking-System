import { IsDateString, IsInt, IsMilitaryTime, Min } from "class-validator"
import { ApiProperty } from '@nestjs/swagger'

export class CreateSlotDto {
    @ApiProperty({ example: '2025-04-15', description: 'Date of the slot (YYYY-MM-DD)' })
    @IsDateString()
    date: string

    @ApiProperty({ example: '09:00', description: 'Start time (HH:mm)' })
    @IsMilitaryTime()
    startTime: string

    @ApiProperty({ example: '09:30', description: 'End time (HH:mm)' })
    @IsMilitaryTime()
    endTime: string

    @ApiProperty({ example: 30, description: 'Duration in minutes' })
    @IsInt()
    @Min(1)
    duration: number
}
