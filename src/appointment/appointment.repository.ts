import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Appointment } from "./appointment.entity";
import { AppointmentStatus } from "../common/enums/appointment-status.enum";

@Injectable()
export class AppointmentRepository {
    constructor(
        @InjectRepository(Appointment) private readonly repo: Repository<Appointment>,
    ) { }

    save(appointment: Appointment) {
        return this.repo.save(appointment);
    }

    findByIdAndUserId(id: number, userId: number) {
        return this.repo.findOne({
            where: { id, user: { id: userId } },
            relations: ['slot']
        });
    }

    async findByUser(userId: number, skip: number, take: number) {
        const [data, total] = await this.repo.findAndCount({
            where: { user: { id: userId } },
            relations: ['slot', 'slot.provider'],
            skip,
            take,
            order: { createdAt: 'DESC' }
        });
        return { data, total };
    }

    findById(id: number) {
        return this.repo.findOne({
            where: { id },
            relations: ['user', 'slot', 'slot.provider']
        });
    }

    findUpcomingForReminder(now: Date, after30Mins: Date) {
        return this.repo
            .createQueryBuilder('appointment')
            .innerJoinAndSelect('appointment.slot', 'slot')
            .innerJoinAndSelect('appointment.user', 'user')
            .innerJoinAndSelect('slot.provider', 'provider')
            .where('appointment.status = :status', { status: AppointmentStatus.BOOKED })
            .andWhere('appointment.reminderSent = false')
            .andWhere('slot.startDate > :now AND slot.startDate <= :after30Mins', { now, after30Mins })
            .getMany();
    }

    markExpiredAsCompleted(now: Date) {
        return this.repo.query(
            `UPDATE appointment SET status = $1 WHERE status = $2 AND "slotId" IN (SELECT id FROM slot WHERE "endDate" < $3)`,
            [AppointmentStatus.COMPLETED, AppointmentStatus.BOOKED, now]
        );
    }
}
