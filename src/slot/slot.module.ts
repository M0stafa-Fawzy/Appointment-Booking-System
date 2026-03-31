import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { SlotController } from "./slot.controller";
import { SlotService } from "./slot.service";
import { SlotRepository } from "./slot.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Slot } from "./slot.entity";
import { AuthMiddleware } from "src/middlewares/auth.middleware";
import { AuthModule } from "src/auth/auth.module";

@Module({
    controllers: [SlotController],
    imports: [TypeOrmModule.forFeature([Slot]), AuthModule],
    providers: [SlotRepository, SlotService],
    exports: [SlotRepository, SlotService]
})
export class SlotModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(SlotController)
    }
}
