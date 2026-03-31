import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "src/user/user.entity"
import { Appointment } from "src/appointment/appointment.entity"

@Entity()
export class Slot {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'date' })
    date: string

    @Column({ type: 'time' })
    startTime: string

    @Column({ type: 'time' })
    endTime: string

    @Column({ type: 'int' })
    duration: number

    @Column({ type: 'timestamp' })
    startDate: Date

    @Column({ type: 'timestamp' })
    endDate: Date

    @Column({ default: false })
    isBooked: boolean

    @ManyToOne(() => User, (user) => user.slots, {
        nullable: false,
        onDelete: 'CASCADE'
    })
    provider: User

    @OneToOne(() => Appointment, (appointment) => appointment.slot)
    appointment: Appointment

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
