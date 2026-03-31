import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "src/user/user.entity"
import { Slot } from "src/slot/slot.entity"
import { AppointmentStatus } from "../common/enums/appointment-status.enum"

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 50, default: AppointmentStatus.BOOKED })
    status: AppointmentStatus

    @Column({ default: false })
    reminderSent: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(() => User, (user) => user.appointments, {
        nullable: false,
        onDelete: 'CASCADE'
    })
    user: User

    @OneToOne(() => Slot, (slot) => slot.appointment, {
        nullable: false,
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    slot: Slot
}
