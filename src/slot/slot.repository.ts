import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { Slot } from "./slot.entity";
import { User } from "src/user/user.entity";

@Injectable()
export class SlotRepository {
    constructor(@InjectRepository(Slot) private readonly repo: Repository<Slot>) { }

    creat(data: Partial<Slot>) {
        const slot = this.repo.create(data);
        return this.repo.save(slot);
    }

    findById(id: number) {
        return this.repo.findOne({ where: { id }, relations: ['provider'] });
    }

    findByIdAndProvider(id: number, providerId: number) {
        return this.repo.findOne({
            where: { id, provider: { id: providerId } }
        });
    }

    save(slot: Slot) {
        return this.repo.save(slot);
    }

    remove(slot: Slot) {
        return this.repo.remove(slot);
    }

    async findByProvider(providerId: number, skip: number, take: number) {
        const [data, total] = await this.repo.findAndCount({
            where: { provider: { id: providerId } },
            relations: ['appointment', 'appointment.user'],
            skip,
            take,
            order: { date: 'ASC', startTime: 'ASC' }
        });
        return { data, total };
    }

    async findAvailable(skip: number, take: number, providerId?: number) {
        const where: FindOptionsWhere<Slot> = { isBooked: false };
        if (providerId) where.provider = { id: providerId } as FindOptionsWhere<User>;

        const [data, total] = await this.repo.findAndCount({
            where,
            relations: ['provider'],
            skip,
            take,
            order: { date: 'ASC', startTime: 'ASC' }
        });
        return { data, total };
    }
}
