import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common'
import { AppointmentService } from './appointment.service';
import { ProfileDecorator } from 'src/decorators/profile.decorator';
import { User } from 'src/user/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AppointmentDto } from './dtos/appointment.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ApiTags, ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { BookAppointmentDto } from './dtos/book-appointment.dto';

@ApiTags('Appointments')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller("/appointments")
export class AppointmentController {
    constructor(private readonly appointmentService: AppointmentService) { }

    @Post('')
    @ApiOperation({ summary: 'Book an available slot' })
    @ApiBody({ type: BookAppointmentDto })
    @ApiResponse({ status: 201, description: 'Appointment booked successfully', type: AppointmentDto })
    @ApiResponse({ status: 400, description: 'Slot already booked or cannot book own slot' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Slot not found' })
    @Roles(Role.USER)
    @UseGuards(RolesGuard)
    @Serialize(AppointmentDto)
    create(@Body() { slotId }: BookAppointmentDto, @ProfileDecorator() user: User) {
        return this.appointmentService.create(slotId, user)
    }

    @Put('/cancel/:id')
    @ApiOperation({ summary: 'Cancel your own appointment' })
    @ApiParam({ name: 'id', type: Number, description: 'Appointment ID' })
    @ApiResponse({ status: 200, description: 'Appointment cancelled successfully', type: AppointmentDto })
    @ApiResponse({ status: 400, description: 'Only booked appointments can be cancelled' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Appointment not found' })
    @HttpCode(200)
    @Serialize(AppointmentDto)
    cancel(@Param('id', ParseIntPipe) id: number, @ProfileDecorator() user: User) {
        return this.appointmentService.cancel(id, user.id)
    }

    @Get('/my')
    @ApiOperation({ summary: 'Get all my appointments' })
    @ApiResponse({ status: 200, description: 'Paginated list of user appointments' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @HttpCode(200)
    getMyAppointments(@Query() pagination: PaginationDto, @ProfileDecorator() user: User) {
        return this.appointmentService.getMyAppointments(pagination, user.id)
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get appointment details by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Appointment ID' })
    @ApiResponse({ status: 200, description: 'Appointment details', type: AppointmentDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Appointment not found' })
    @HttpCode(200)
    @Serialize(AppointmentDto)
    getById(@Param('id', ParseIntPipe) id: number) {
        return this.appointmentService.getById(id)
    }
}
