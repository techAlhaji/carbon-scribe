import { Test, TestingModule } from '@nestjs/testing';
import { ComplianceService } from './compliance.service';
import { PrismaService } from '../shared/database/prisma.service';
import { SecurityService } from '../security/security.service';
import {
  CheckComplianceDto,
  ComplianceFramework,
  EntityType,
} from './dto/check-compliance.dto';
import { ComplianceStatus } from './dto/compliance-status.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ComplianceService', () => {
  let service: ComplianceService;

  const mockPrismaService = {
    compliance: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    credit: {
      findFirst: jest.fn(),
    },
    project: {
      findFirst: jest.fn(),
    },
    company: {
      findUnique: jest.fn(),
    },
  };

  const mockSecurityService = {
    logEvent: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComplianceService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: SecurityService,
          useValue: mockSecurityService,
        },
      ],
    }).compile();

    service = module.get<ComplianceService>(ComplianceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkCompliance', () => {
    it('should successfully check compliance for CBAM framework', async () => {
      const companyId = 'company-123';
      const dto: CheckComplianceDto = {
        framework: ComplianceFramework.CBAM,
        entityType: EntityType.CREDIT,
        entityId: 'credit-123',
      };

      mockPrismaService.credit.findFirst.mockResolvedValue({
        id: 'credit-123',
        companyId,
      });

      mockPrismaService.compliance.create.mockResolvedValue({
        id: 'comp-123',
        companyId,
        framework: ComplianceFramework.CBAM,
        status: ComplianceStatus.COMPLIANT,
      });

      const result = await service.checkCompliance(companyId, dto);

      expect(result).toBeDefined();
      expect(result.framework).toBe(ComplianceFramework.CBAM);
      expect(result.entityId).toBe('credit-123');
      expect(result.status).toBeDefined();
      expect(mockSecurityService.logEvent).toHaveBeenCalled();
    });

    it('should throw error if credit does not exist', async () => {
      const companyId = 'company-123';
      const dto: CheckComplianceDto = {
        framework: ComplianceFramework.CBAM,
        entityType: EntityType.CREDIT,
        entityId: 'credit-invalid',
      };

      mockPrismaService.credit.findFirst.mockResolvedValue(null);

      await expect(service.checkCompliance(companyId, dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should validate different entity types', async () => {
      const companyId = 'company-123';

      // Project entity
      const projectDto: CheckComplianceDto = {
        framework: ComplianceFramework.ARTICLE_6,
        entityType: EntityType.PROJECT,
        entityId: 'project-123',
      };

      mockPrismaService.project.findFirst.mockResolvedValue({
        id: 'project-123',
        companyId,
      });

      mockPrismaService.compliance.create.mockResolvedValue({
        id: 'comp-123',
        companyId,
        framework: ComplianceFramework.ARTICLE_6,
      });

      const result = await service.checkCompliance(companyId, projectDto);

      expect(result).toBeDefined();
      expect(result.entityType).toBe(EntityType.PROJECT);
    });
  });

  describe('getComplianceStatus', () => {
    it('should retrieve compliance status for an entity', async () => {
      const companyId = 'company-123';
      const entityId = 'entity-123';

      mockPrismaService.compliance.findFirst.mockResolvedValue({
        id: entityId,
      });

      mockPrismaService.compliance.findMany.mockResolvedValue([
        {
          id: 'comp-1',
          companyId,
          framework: ComplianceFramework.CBAM,
          status: ComplianceStatus.COMPLIANT,
          dueDate: new Date(),
          completedAt: new Date(),
          requirements: null,
        },
        {
          id: 'comp-2',
          companyId,
          framework: ComplianceFramework.CORSIA,
          status: ComplianceStatus.IN_PROGRESS,
          dueDate: new Date(),
          completedAt: null,
          requirements: null,
        },
      ]);

      const result = await service.getComplianceStatus(companyId, entityId);

      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].framework).toBe(ComplianceFramework.CBAM);
      expect(result[0].status).toBe(ComplianceStatus.COMPLIANT);
    });

    it('should throw NotFoundException if entity does not exist', async () => {
      const companyId = 'company-123';
      const entityId = 'entity-invalid';

      mockPrismaService.compliance.findFirst.mockResolvedValue(null);

      await expect(
        service.getComplianceStatus(companyId, entityId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getComplianceReport', () => {
    it('should generate compliance report successfully', async () => {
      const companyId = 'company-123';
      const entityId = 'company-123';

      mockPrismaService.compliance.findMany.mockResolvedValue([
        {
          id: 'comp-1',
          companyId,
          framework: ComplianceFramework.CBAM,
          status: ComplianceStatus.COMPLIANT,
          requirements: [],
          dueDate: null,
          completedAt: null,
        },
        {
          id: 'comp-2',
          companyId,
          framework: ComplianceFramework.CORSIA,
          status: ComplianceStatus.IN_PROGRESS,
          requirements: [],
          dueDate: null,
          completedAt: null,
        },
      ]);

      const result = await service.getComplianceReport(companyId, entityId);

      expect(result).toBeDefined();
      expect(result.reportId).toBeDefined();
      expect(result.frameworks.length).toBeGreaterThan(0);
      expect(result.overallCompliance).toBeGreaterThanOrEqual(0);
      expect(result.overallCompliance).toBeLessThanOrEqual(100);
      expect(result.summaryStatus).toBeDefined();
    });

    it('should throw NotFoundException if no compliance records found', async () => {
      const companyId = 'company-123';
      const entityId = 'company-123';

      mockPrismaService.compliance.findMany.mockResolvedValue([]);

      await expect(
        service.getComplianceReport(companyId, entityId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('Framework validators', () => {
    it('should validate CBAM framework', async () => {
      const result = await service.validateCBam('entity-123');

      expect(result).toBeDefined();
      expect(result.framework).toBe(ComplianceFramework.CBAM);
      expect(result.issues).toBeDefined();
      expect(Array.isArray(result.issues)).toBe(true);
      expect(result.requirements).toBeDefined();
      expect(Array.isArray(result.requirements)).toBe(true);
      expect(result.recommendations).toBeDefined();
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    it('should validate CORSIA framework', async () => {
      const result = await service.validateCorsia('entity-123');

      expect(result).toBeDefined();
      expect(result.framework).toBe(ComplianceFramework.CORSIA);
      expect(result.issues.length).toBeGreaterThan(0);
    });

    it('should validate SBTi framework', async () => {
      const result = await service.validateSBTi('entity-123');

      expect(result).toBeDefined();
      expect(result.framework).toBe(ComplianceFramework.SBTi);
      expect(result.requirements.length).toBeGreaterThan(0);
    });

    it('should validate Article 6 framework', async () => {
      const result = await service.validateArticle6('entity-123');

      expect(result).toBeDefined();
      expect(result.framework).toBe(ComplianceFramework.ARTICLE_6);
    });

    it('should validate CDP framework', async () => {
      const result = await service.validateCDP('entity-123');

      expect(result).toBeDefined();
      expect(result.framework).toBe(ComplianceFramework.CDP);
    });

    it('should validate GRI framework', async () => {
      const result = await service.validateGRI('entity-123');

      expect(result).toBeDefined();
      expect(result.framework).toBe(ComplianceFramework.GRI);
    });

    it('should validate CSRD framework', async () => {
      const result = await service.validateCSRD('entity-123');

      expect(result).toBeDefined();
      expect(result.framework).toBe(ComplianceFramework.CSRD);
    });

    it('should validate TCFD framework', async () => {
      const result = await service.validateTCFD('entity-123');

      expect(result).toBeDefined();
      expect(result.framework).toBe(ComplianceFramework.TCFD);
    });
  });

  describe('Error handling', () => {
    it('should handle database errors gracefully', async () => {
      const companyId = 'company-123';
      const entityId = 'entity-123';

      mockPrismaService.compliance.findFirst.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(
        service.getComplianceStatus(companyId, entityId),
      ).rejects.toThrow();
    });

    it('should log security events for compliance checks', async () => {
      const companyId = 'company-123';
      const dto: CheckComplianceDto = {
        framework: ComplianceFramework.CBAM,
        entityType: EntityType.CREDIT,
        entityId: 'credit-123',
      };

      mockPrismaService.credit.findFirst.mockResolvedValue({
        id: 'credit-123',
        companyId,
      });

      mockPrismaService.compliance.create.mockResolvedValue({
        id: 'comp-123',
        companyId,
        framework: ComplianceFramework.CBAM,
        status: ComplianceStatus.COMPLIANT,
        requirements: null,
        dueDate: null,
        completedAt: null,
      });

      await service.checkCompliance(companyId, dto);

      expect(mockSecurityService.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          companyId,
          resource: '/api/v1/compliance/check',
          method: 'POST',
          status: 'success',
        }),
      );
    });

    it('should log security events for report generation', async () => {
      const companyId = 'company-123';
      const entityId = 'company-123';

      mockPrismaService.compliance.findMany.mockResolvedValue([
        {
          id: 'comp-1',
          companyId,
          framework: ComplianceFramework.CBAM,
          status: ComplianceStatus.COMPLIANT,
          requirements: [],
          dueDate: null,
          completedAt: null,
        },
      ]);

      await service.getComplianceReport(companyId, entityId);

      expect(mockSecurityService.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          companyId,
          resource: `/api/v1/compliance/report/${entityId}`,
          method: 'GET',
          status: 'success',
        }),
      );
    });
  });
});
