import { Test, TestingModule } from '@nestjs/testing';
import { ComplianceController } from './compliance.controller';
import { ComplianceService } from './compliance.service';
import { SecurityService } from '../security/security.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../rbac/guards/permissions.guard';
import { IpWhitelistGuard } from '../security/guards/ip-whitelist.guard';
import {
  CheckComplianceDto,
  ComplianceFramework,
  EntityType,
} from './dto/check-compliance.dto';
import { ComplianceStatus } from './dto/compliance-status.dto';

describe('ComplianceController', () => {
  let controller: ComplianceController;

  const mockComplianceService = {
    checkCompliance: jest.fn(),
    getComplianceStatus: jest.fn(),
    getComplianceReport: jest.fn(),
  };

  const mockSecurityService = {
    logEvent: jest.fn().mockResolvedValue(undefined),
  };

  const mockUser = {
    sub: 'user-123',
    email: 'test@example.com',
    companyId: 'company-123',
    role: 'manager',
    sessionId: 'session-123',
  };

  beforeEach(async () => {
    const moduleBuilder = Test.createTestingModule({
      controllers: [ComplianceController],
      providers: [
        {
          provide: ComplianceService,
          useValue: mockComplianceService,
        },
        {
          provide: SecurityService,
          useValue: mockSecurityService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideGuard(IpWhitelistGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) });

    const module: TestingModule = await moduleBuilder.compile();

    controller = module.get<ComplianceController>(ComplianceController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkCompliance', () => {
    it('should successfully check compliance', async () => {
      const dto: CheckComplianceDto = {
        framework: ComplianceFramework.CBAM,
        entityType: EntityType.CREDIT,
        entityId: 'credit-123',
      };

      const mockResult = {
        framework: ComplianceFramework.CBAM,
        entityId: 'credit-123',
        entityType: EntityType.CREDIT,
        status: ComplianceStatus.COMPLIANT,
        timestamp: new Date(),
        issues: [],
        requirements: [],
        recommendations: [],
      };

      mockComplianceService.checkCompliance.mockResolvedValue(mockResult);

      const result = await controller.checkCompliance(mockUser, dto);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResult);
      expect(mockComplianceService.checkCompliance).toHaveBeenCalledWith(
        mockUser.companyId,
        dto,
      );
    });

    it('should throw error if required fields are missing', async () => {
      const dto: any = {
        framework: ComplianceFramework.CBAM,
        // entityType and entityId missing
      };

      await expect(controller.checkCompliance(mockUser, dto)).rejects.toThrow();
    });
  });

  describe('getComplianceStatus', () => {
    it('should successfully get compliance status', async () => {
      const entityId = 'credit-123';
      const mockResult = [
        {
          entityId,
          framework: ComplianceFramework.CBAM,
          status: ComplianceStatus.COMPLIANT,
        },
      ];

      mockComplianceService.getComplianceStatus.mockResolvedValue(mockResult);

      const result = await controller.getComplianceStatus(mockUser, entityId);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResult);
      expect(mockSecurityService.logEvent).toHaveBeenCalled();
    });

    it('should throw error if entityId is missing', async () => {
      await expect(
        controller.getComplianceStatus(mockUser, ''),
      ).rejects.toThrow();
    });
  });

  describe('getComplianceReport', () => {
    it('should successfully get compliance report', async () => {
      const entityId = 'company-123';
      const mockResult = {
        reportId: 'report-123',
        entityId,
        entityType: 'COMPANY',
        generatedAt: new Date(),
        frameworks: [ComplianceFramework.CBAM, ComplianceFramework.CORSIA],
        summaryStatus: ComplianceStatus.COMPLIANT,
        overallCompliance: 95,
        frameworkReports: [],
        issues: [],
        recommendations: [],
        nextReviewDate: new Date(),
      };

      mockComplianceService.getComplianceReport.mockResolvedValue(mockResult);

      const result = await controller.getComplianceReport(mockUser, entityId);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResult);
      expect(mockSecurityService.logEvent).toHaveBeenCalled();
    });

    it('should throw error if entityId is missing', async () => {
      await expect(
        controller.getComplianceReport(mockUser, ''),
      ).rejects.toThrow();
    });
  });

  describe('Security logging', () => {
    it('should log compliance check events', async () => {
      const dto: CheckComplianceDto = {
        framework: ComplianceFramework.CBAM,
        entityType: EntityType.CREDIT,
        entityId: 'credit-123',
      };

      const mockResult = {
        framework: ComplianceFramework.CBAM,
        entityId: 'credit-123',
        entityType: EntityType.CREDIT,
        status: ComplianceStatus.COMPLIANT,
        timestamp: new Date(),
        issues: [],
        requirements: [],
        recommendations: [],
      };

      mockComplianceService.checkCompliance.mockResolvedValue(mockResult);

      await controller.checkCompliance(mockUser, dto);

      expect(mockSecurityService.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          companyId: mockUser.companyId,
          resource: '/api/v1/compliance/check',
          method: 'POST',
        }),
      );
    });

    it('should log status check events', async () => {
      const entityId = 'credit-123';
      const mockResult = [];

      mockComplianceService.getComplianceStatus.mockResolvedValue(mockResult);

      await controller.getComplianceStatus(mockUser, entityId);

      expect(mockSecurityService.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          companyId: mockUser.companyId,
          userId: mockUser.sub,
          resource: `/api/v1/compliance/status/${entityId}`,
          method: 'GET',
        }),
      );
    });

    it('should log report generation events', async () => {
      const entityId = 'company-123';
      const mockResult = {
        reportId: 'report-123',
        entityId,
        entityType: 'COMPANY',
        generatedAt: new Date(),
        frameworks: [],
        summaryStatus: ComplianceStatus.COMPLIANT,
        overallCompliance: 95,
        frameworkReports: [],
        issues: [],
        recommendations: [],
        nextReviewDate: new Date(),
      };

      mockComplianceService.getComplianceReport.mockResolvedValue(mockResult);

      await controller.getComplianceReport(mockUser, entityId);

      expect(mockSecurityService.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          companyId: mockUser.companyId,
          userId: mockUser.sub,
          resource: `/api/v1/compliance/report/${entityId}`,
          method: 'GET',
          status: 'success',
        }),
      );
    });
  });
});
