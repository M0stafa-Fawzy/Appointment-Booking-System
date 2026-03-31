import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppointmentController } from "./appointment.controller";
import { AppointmentService } from "./appointment.service";
import { AppointmentRepository } from "./appointment.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Appointment } from "./appointment.entity";
import { AuthMiddleware } from "src/middlewares/auth.middleware";
import { AuthModule } from "src/auth/auth.module";
import { SlotModule } from "src/slot/slot.module";

@Module({
    controllers: [AppointmentController],
    imports: [TypeOrmModule.forFeature([Appointment]), AuthModule, SlotModule],
    providers: [AppointmentRepository, AppointmentService],
    exports: [AppointmentRepository, AppointmentService]
})
export class AppointmentModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(AppointmentController)
    }
}
