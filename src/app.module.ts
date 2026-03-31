import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SlotModule } from './slot/slot.module';
import { AppointmentModule } from './appointment/appointment.module';
import { CronModule } from './cron/cron.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ProfileInterceptor } from './interceptors/profile.interceptor';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    SlotModule,
    AppointmentModule,
    CronModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false
      })
    })
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ProfileInterceptor
    }
  ]
})
export class AppModule { }
