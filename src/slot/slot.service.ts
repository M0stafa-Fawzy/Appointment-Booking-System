import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateSlotDto } from "./dtos/create-slot.dto";
import { UpdateSlotDto } from "./dtos/update-slot.dto";
import { User } from "src/user/user.entity";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { SlotRepository } from "./slot.repository";

@Injectable()
export class SlotService {
    constructor(private readonly slotRepository: SlotRepository) { }

    private validateSlotTimes(date: string, startTime: string, endTime: string) {
        if (startTime >= endTime) {
            throw new BadRequestException('endTime must be after startTime')
        }

        const startDate = new Date(`${date}T${startTime}`);
        const endDate = new Date(`${date}T${endTime}`);

        if (startDate < new Date()) {
            throw new BadRequestException('Cannot create or update a slot in the past')
        }

        return { startDate, endDate };
    }

    create(data: CreateSlotDto, provider: User) {
        const { startDate, endDate } = this.validateSlotTimes(data.date, data.startTime, data.endTime);
        return this.slotRepository.creat({ ...data, startDate, endDate, provider });
    }

    getMySlots({ page, limit }: PaginationDto, providerId: number) {
        return this.slotRepository.findByProvider(providerId, (+page - 1) * +limit, +limit);
    }

    getAvailable({ page, limit }: PaginationDto, providerId?: number) {
        return this.slotRepository.findAvailable((+page - 1) * +limit, +limit, providerId);
    }

    async getById(id: number) {
        const slot = await this.slotRepository.findById(id);
        if (!slot) throw new NotFoundException('Slot not found')
        return slot;
    }

    async update(data: UpdateSlotDto, id: number, providerId: number) {
        const slot = await this.slotRepository.findByIdAndProvider(id, providerId);
        if (!slot) throw new NotFoundException('Slot not found')

        if (slot.isBooked) throw new BadRequestException('Cannot edit a booked slot')
        Object.assign(slot, data);

        const { startDate, endDate } = this.validateSlotTimes(slot.date, slot.startTime, slot.endTime);
        slot.startDate = startDate;
        slot.endDate = endDate;

        return this.slotRepository.save(slot);
    }

    async delete(id: number, providerId: number) {
        const slot = await this.slotRepository.findByIdAndProvider(id, providerId);
        if (!slot) throw new NotFoundException('Slot not found')

        if (slot.isBooked) throw new BadRequestException('Cannot delete a booked slot')
        return this.slotRepository.remove(slot);
    }

    async findOneById(id: number) {
        const slot = await this.slotRepository.findById(id);
        if (!slot) throw new NotFoundException('Slot not found')
        return slot;
    }
}
