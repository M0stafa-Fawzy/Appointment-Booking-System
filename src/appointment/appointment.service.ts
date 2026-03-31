import { AppointmentStatus } from "../common/enums/appointment-status.enum";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { DataSource } from "typeorm";
import { User } from "src/user/user.entity";
import { Slot } from "src/slot/slot.entity";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { AppointmentRepository } from "./appointment.repository";
import { SlotRepository } from "src/slot/slot.repository";
import { Appointment } from "./appointment.entity";

@Injectable()
export class AppointmentService {
    constructor(
        private readonly appointmentRepository: AppointmentRepository,
        private readonly slotRepository: SlotRepository,
        private readonly dataSource: DataSource
    ) { }

    async create(slotId: number, user: User) {
        const slot = await this.slotRepository.findById(slotId);
        if (!slot) throw new NotFoundException('Slot not found')
        if (slot.isBooked) throw new BadRequestException('This slot is already booked')

        return this.dataSource.transaction(async (manager) => {
            slot.isBooked = true;
            await manager.save(Slot, slot);
            const appointment = manager.create(Appointment, { slot, user, status: AppointmentStatus.BOOKED });
            return manager.save(Appointment, appointment);
        });
    }

    async cancel(appointmentId: number, userId: number) {
        const appointment = await this.appointmentRepository.findByIdAndUserId(appointmentId, userId);
        if (!appointment) throw new NotFoundException('Appointment not found')
        if (appointment.status !== AppointmentStatus.BOOKED) throw new BadRequestException('Only booked appointments can be cancelled')

        return this.dataSource.transaction(async (manager) => {
            appointment.status = AppointmentStatus.CANCELLED;
            await manager.save(Appointment, appointment);
            appointment.slot.isBooked = false;
            await manager.save(Slot, appointment.slot);
            return appointment;
        });
    }

    getMyAppointments({ page, limit }: PaginationDto, userId: number) {
        return this.appointmentRepository.findByUser(userId, (+page - 1) * +limit, +limit);
    }

    async getById(id: number) {
        const appointment = await this.appointmentRepository.findById(id);
        if (!appointment) throw new NotFoundException('Appointment not found')
        return appointment;
    }
}
