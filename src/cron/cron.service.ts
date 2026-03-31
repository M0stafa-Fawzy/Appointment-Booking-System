import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AppointmentRepository } from "src/appointment/appointment.repository";
import { MailService } from "src/mail/mail.service";

@Injectable()
export class CronService {
    constructor(
        private readonly appointmentRepository: AppointmentRepository,
        private readonly mailService: MailService
    ) { }

    @Cron(CronExpression.EVERY_30_SECONDS)
    async sendReminders() {
        console.log("first")
        const now = new Date();
        const after30Mins = new Date(now.getTime() + 30 * 60 * 1000);

        const appointments = await this.appointmentRepository.findUpcomingForReminder(now, after30Mins);
        console.log({ appointments })
        for (const appointment of appointments) {
            const sent = await this.mailService.sendReminder(
                appointment.user.email,
                appointment.user.name,
                {
                    date: appointment.slot.date,
                    startTime: appointment.slot.startTime,
                    endTime: appointment.slot.endTime,
                    providerName: appointment.slot.provider.name,
                }
            );

            if (sent) {
                // set reminderSent to true
                await this.appointmentRepository.save({ ...appointment, reminderSent: true });
                console.log(`sent reminder for appointment ${appointment.id}`);
            }
        }
    }

    @Cron(CronExpression.EVERY_30_SECONDS)
    async markExpiredAppointments() {
        console.log("second")

        // fire and forget no need for another check
        await this.appointmentRepository.markExpiredAsCompleted(new Date());
    }
}
