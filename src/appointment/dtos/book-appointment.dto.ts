import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsPositive } from 'class-validator'

export class BookAppointmentDto {
    @ApiProperty({ example: 1, description: 'ID of the slot to book' })
    @IsInt()
    @IsPositive()
    slotId: number
}
