import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common'
import { SlotService } from './slot.service';
import { CreateSlotDto } from './dtos/create-slot.dto';
import { UpdateSlotDto } from './dtos/update-slot.dto';
import { ProfileDecorator } from 'src/decorators/profile.decorator';
import { User } from 'src/user/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { SlotDto } from './dtos/slot.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Slots')
@Controller("/slots")
export class SlotController {
    constructor(private readonly slotService: SlotService) { }

    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new time slot' })
    @ApiResponse({ status: 201, description: 'Slot created successfully', type: SlotDto })
    @ApiResponse({ status: 400, description: 'Invalid slot data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @Roles(Role.PROVIDER)
    @UseGuards(AuthGuard, RolesGuard)
    @Serialize(SlotDto)
    @HttpCode(201)
    create(@Body() data: CreateSlotDto, @ProfileDecorator() user: User) {
        return this.slotService.create(data, user)
    }

    @Get('/my')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all my slots with booking info' })
    @ApiResponse({ status: 200, description: 'List of provider slots with pagination' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @Roles(Role.PROVIDER)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(200)
    getMySlots(@Query() pagination: PaginationDto, @ProfileDecorator() user: User) {
        return this.slotService.getMySlots(pagination, user.id)
    }

    @Get('/available')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all available (unbooked) slots, optionally filtered by provider' })
    @ApiQuery({ name: 'providerId', required: false, type: Number, description: 'Filter by provider ID' })
    @ApiResponse({ status: 200, description: 'List of available slots with pagination' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @UseGuards(AuthGuard)
    @HttpCode(200)
    getAvailable(@Query() pagination: PaginationDto, @Query('providerId') providerId?: string) {
        return this.slotService.getAvailable(pagination, providerId ? +providerId : undefined)
    }

    @Put("/:id")
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a time slot' })
    @ApiParam({ name: 'id', type: Number, description: 'Slot ID' })
    @ApiResponse({ status: 200, description: 'Slot updated successfully', type: SlotDto })
    @ApiResponse({ status: 400, description: 'Cannot edit a booked slot' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Slot not found' })
    @Roles(Role.PROVIDER)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(200)
    @Serialize(SlotDto)
    update(@Body() data: UpdateSlotDto, @Param("id", ParseIntPipe) id: number, @ProfileDecorator() user: User) {
        return this.slotService.update(data, id, user.id)
    }

    @Get("/:id")
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get a time slot by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'Slot ID' })
    @ApiResponse({ status: 200, description: 'Slot found', type: SlotDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Slot not found' })
    @UseGuards(AuthGuard)
    @HttpCode(200)
    get(@Param("id", ParseIntPipe) id: number) {
        return this.slotService.getById(id)
    }

    @Delete("/:id")
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a time slot' })
    @ApiParam({ name: 'id', type: Number, description: 'Slot ID' })
    @ApiResponse({ status: 200, description: 'Slot deleted successfully' })
    @ApiResponse({ status: 400, description: 'Cannot delete a booked slot' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Slot not found' })
    @Roles(Role.PROVIDER)
    @UseGuards(AuthGuard, RolesGuard)
    @HttpCode(200)
    delete(@Param("id", ParseIntPipe) id: number, @ProfileDecorator() user: User) {
        return this.slotService.delete(id, user.id)
    }
}
