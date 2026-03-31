import { Expose, Transform } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"

export class SlotDto {
    @ApiProperty({ example: 1 })
    @Expose()
    id: number

    @ApiProperty({ example: '2025-04-15' })
    @Expose()
    date: string

    @ApiProperty({ example: '09:00' })
    @Expose()
    startTime: string

    @ApiProperty({ example: '09:30' })
    @Expose()
    endTime: string

    @ApiProperty({ example: 30 })
    @Expose()
    duration: number

    @ApiProperty({ example: false })
    @Expose()
    isBooked: boolean

    @ApiProperty({ example: 1, description: 'ID of the provider who owns the slot' })
    @Transform(({ obj }) => obj.provider?.id)
    @Expose()
    providerId: number
}
