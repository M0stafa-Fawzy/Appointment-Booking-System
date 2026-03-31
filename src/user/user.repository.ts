import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { SignUpDto } from "src/auth/dtos/signUp.dto";

@Injectable()
export class UserRepository {
    constructor(@InjectRepository(User) private readonly repo: Repository<User>) { }

    findByEmail(email: string) {
        return this.repo.findOne({
            where: { email },
            select: ['id', 'name', 'email', 'password', 'role']
        });
    }

    findById(id: number) {
        return this.repo.findOne({ where: { id } });
    }

    createUser(data: SignUpDto) {
        const user = this.repo.create(data);
        return this.repo.save(user);
    }
}
