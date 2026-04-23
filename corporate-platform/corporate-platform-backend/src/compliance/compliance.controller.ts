import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { CheckComplianceDto } from './dto/check-compliance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { PermissionsGuard } from '../rbac/guards/permissions.guard';
import { Permissions } from '../rbac/decorators/permissions.decorator';
import {
  COMPLIANCE_SUBMIT,
  COMPLIANCE_VIEW,
} from '../rbac/constants/permissions.constants';
import { IpWhitelistGuard } from '../security/guards/ip-whitelist.guard';
import { SecurityService } from '../security/security.service';
import { SecurityEvents } from '../security/constants/security-events.constants';

@UseGuards(JwtAuthGuard, PermissionsGuard, IpWhitelistGuard)
@Controller('api/v1/compliance')
export class ComplianceController {
  constructor(
    private complianceService: ComplianceService,
    private securityService: SecurityService,
  ) {}

  /**
   * Run compliance checks on a transaction or credit
   * POST /api/v1/compliance/check
   */
  @Post('check')
  @Permissions(COMPLIANCE_SUBMIT)
  async checkCompliance(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CheckComplianceDto,
  ) {
    if (!dto.framework || !dto.entityType || !dto.entityId) {
      throw new BadRequestException(
        'framework, entityType, and entityId are required',
      );
    }

    const result = await this.complianceService.checkCompliance(
      user.companyId,
      dto,
    );

    await this.securityService.logEvent({
      eventType: SecurityEvents.ReportExported,
      companyId: user.companyId,
      userId: user.sub,
      resource: `/api/v1/compliance/check`,
      method: 'POST',
      status: 'success',
      statusCode: 200,
      details: {
        framework: dto.framework,
        entityType: dto.entityType,
        entityId: dto.entityId,
      },
    });

    return {
      success: true,
      data: result,
      timestamp: new Date(),
    };
  }

  /**
   * Get compliance status for an entity
   * GET /api/v1/compliance/status/:entityId
   */
  @Get('status/:entityId')
  @Permissions(COMPLIANCE_VIEW)
  async getComplianceStatus(
    @CurrentUser() user: JwtPayload,
    @Param('entityId') entityId: string,
  ) {
    if (!entityId) {
      throw new BadRequestException('entityId is required');
    }

    const result = await this.complianceService.getComplianceStatus(
      user.companyId,
      entityId,
    );

    await this.securityService.logEvent({
      eventType: SecurityEvents.ReportExported,
      companyId: user.companyId,
      userId: user.sub,
      resource: `/api/v1/compliance/status/${entityId}`,
      method: 'GET',
      status: 'success',
      statusCode: 200,
    });

    return {
      success: true,
      data: result,
      timestamp: new Date(),
    };
  }

  /**
   * Generate or retrieve compliance report for an entity
   * GET /api/v1/compliance/report/:entityId
   */
  @Get('report/:entityId')
  @Permissions(COMPLIANCE_VIEW)
  async getComplianceReport(
    @CurrentUser() user: JwtPayload,
    @Param('entityId') entityId: string,
  ) {
    if (!entityId) {
      throw new BadRequestException('entityId is required');
    }

    const result = await this.complianceService.getComplianceReport(
      user.companyId,
      entityId,
    );

    await this.securityService.logEvent({
      eventType: SecurityEvents.ReportExported,
      companyId: user.companyId,
      userId: user.sub,
      resource: `/api/v1/compliance/report/${entityId}`,
      method: 'GET',
      status: 'success',
      statusCode: 200,
      details: {
        reportId: result.reportId,
        frameworks: result.frameworks,
      },
    });

    return {
      success: true,
      data: result,
      timestamp: new Date(),
    };
  }
}
