import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('projects/:id/stats')
  @ApiOperation({ summary: 'Get project statistics' })
  @ApiResponse({ status: 200, description: 'Project statistics' })
  getProjectStats(@Param('id') id: string) {
    return this.analyticsService.getProjectStats(id);
  }

  @Get('tasks/by-status')
  @ApiOperation({ summary: 'Get tasks grouped by status' })
  @ApiResponse({ status: 200, description: 'Tasks by status' })
  getTasksByStatus(@Query('project') projectId: string) {
    return this.analyticsService.getTasksByStatus(projectId);
  }

  @Get('tasks/by-user')
  @ApiOperation({ summary: 'Get tasks grouped by user' })
  @ApiResponse({ status: 200, description: 'Tasks by user' })
  getTasksByUser(@Query('project') projectId: string) {
    return this.analyticsService.getTasksByUser(projectId);
  }

  @Get('tasks/by-tag')
  @ApiOperation({ summary: 'Get tasks grouped by tag' })
  @ApiResponse({ status: 200, description: 'Tasks by tag' })
  getTasksByTag(@Query('project') projectId: string) {
    return this.analyticsService.getTasksByTag(projectId);
  }

  @Get('tasks/deadlines')
  @ApiOperation({ summary: 'Get tasks with upcoming deadlines' })
  @ApiResponse({ status: 200, description: 'Upcoming deadlines' })
  getUpcomingDeadlines(
    @Query('project') projectId: string,
    @Query('days') days?: number,
  ) {
    return this.analyticsService.getUpcomingDeadlines(projectId, days || 7);
  }
}