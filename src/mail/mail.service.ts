import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
    constructor(private readonly configService: ConfigService) {
        sgMail.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
    }

    async sendReminder(to: string, userName: string, slot: { date: string; startTime: string; endTime: string; providerName: string }) {
        try {
            await sgMail.send({
                from: this.configService.get<string>('MAIL_FROM') || 'noreply@bookings.com',
                to,
                subject: 'Appointment Reminder',
                html: `
                    <h2>Appointment Reminder</h2>
                    <p>Hi ${userName},</p>
                    <p>This is a reminder that you have an upcoming appointment:</p>
                    <ul>
                        <li><strong>Date:</strong> ${slot.date}</li>
                        <li><strong>Time:</strong> ${slot.startTime} - ${slot.endTime}</li>
                        <li><strong>Provider:</strong> ${slot.providerName}</li>
                    </ul>
                    <p>Please be on time!</p>
                `,
            });
            return true;
        } catch (error) {
            console.error(`Failed to send email to ${to}`, error);
            return false;
        }
    }
}
