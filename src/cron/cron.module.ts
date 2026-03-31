import { Module } from "@nestjs/common";
import { CronService } from "./cron.service";
import { AppointmentModule } from "src/appointment/appointment.module";
import { MailModule } from "src/mail/mail.module";

@Module({
    imports: [AppointmentModule, MailModule],
    providers: [CronService],
})
export class CronModule { }
