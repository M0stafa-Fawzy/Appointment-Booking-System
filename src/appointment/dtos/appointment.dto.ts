import { Expose, Transform } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { UserProfileResponse } from "src/auth/dtos/user.dto"
import { SlotDto } from "src/slot/dtos/slot.dto"

export class AppointmentDto {
    @ApiProperty({ example: 1 })
    @Expose()
    id: number

    @ApiProperty({ example: 'booked', enum: ['booked', 'cancelled', 'completed', 'expired'] })
    @Expose()
    status: string

    @ApiProperty({ example: false })
    @Expose()
    reminderSent: boolean

    @ApiProperty({ example: '2025-04-10T12:00:00.000Z' })
    @Expose()
    createdAt: Date

    @ApiProperty({ type: UserProfileResponse })
    @Transform(({ obj }) => {
        if (!obj.user) return null
        return {
            id: obj.user.id,
            name: obj.user.name,
            email: obj.user.email,
            role: obj.user.role
        }
    })
    @Expose()
    user: UserProfileResponse

    @ApiProperty({ type: SlotDto, nullable: true })
    @Transform(({ obj }) => {
        if (!obj.slot) return null
        return {
            id: obj.slot.id,
            date: obj.slot.date,
            startTime: obj.slot.startTime,
            endTime: obj.slot.endTime,
            duration: obj.slot.duration,
            isBooked: obj.slot.isBooked,
            providerId: obj.slot.provider?.id
        }
    })
    @Expose()
    slot: SlotDto
}
