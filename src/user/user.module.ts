import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User])
    ],
    providers: [UserRepository, UserService],
    exports: [UserRepository, UserService, TypeOrmModule]
})
export class UserModule { }
