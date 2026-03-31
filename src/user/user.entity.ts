import { Exclude } from "class-transformer"
import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import * as bcrypt from 'bcrypt'
import { Role } from "src/common/enums/role.enum"
import { Slot } from "src/slot/slot.entity"
import { Appointment } from "src/appointment/appointment.entity"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ unique: true })
    email: string

    @Column({ select: false })
    @Exclude()
    password: string

    @Column({ type: 'varchar', length: 50, nullable: false, enum: Role, default: Role.USER })
    role: string

    @OneToMany(() => Slot, (slot) => slot.provider)
    slots: Slot[]

    @OneToMany(() => Appointment, (appointment) => appointment.user)
    appointments: Appointment[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @BeforeInsert()
    async hashPassword() {
        const salt = await bcrypt.genSalt(8);
        this.password = await bcrypt.hash(this.password, salt);
    }
}
