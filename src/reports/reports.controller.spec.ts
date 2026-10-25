import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { StorageService } from '../storage/storage.service';

// El StorageService real lee variables de AWS al importarse; aquí no hacen falta
jest.mock('../config/envs', () => ({
  envs: {
    AWS_REGION: 'us-east-2',
    AWS_BUCKET: 'bucket-falso',
    AWS_ACCESS_KEY_ID: 'x',
    AWS_SECRET_ACCESS_KEY: 'x',
  },
}));

describe('ReportsController', () => {
  let controller: ReportsController;
  const reportsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    resolve: jest.fn(),
  };
  const storageService = { uploadFile: jest.fn() };
  const dto: any = {
    address: 'Calle 1',
    description: 'Fuga grande',
    severity: 'high',
    reporterPhone: '4771234567',
  };
  const foto: any = { originalname: 'fuga.jpg', mimetype: 'image/jpeg' };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        { provide: ReportsService, useValue: reportsService },
        { provide: StorageService, useValue: storageService },
      ],
    }).compile();

    controller = module.get(ReportsController);
  });

  it('createReport sin foto lanza BadRequestException y no sube ni guarda nada', async () => {
    await expect(controller.createReport(dto, undefined)).rejects.toThrow(BadRequestException);

    expect(storageService.uploadFile).not.toHaveBeenCalled();
    expect(reportsService.create).not.toHaveBeenCalled();
  });

  it('createReport sube la foto a reports/ y guarda el reporte con su URL', async () => {
    storageService.uploadFile.mockResolvedValue('https://bucket/reports/a.jpg');
    reportsService.create.mockResolvedValue({ id: 'abc' });

    const res = await controller.createReport(dto, foto);

    expect(storageService.uploadFile).toHaveBeenCalledWith(foto, 'reports');
    expect(reportsService.create).toHaveBeenCalledWith(dto, 'https://bucket/reports/a.jpg');
    expect(res).toEqual({ id: 'abc' });
  });

  it('resolve sin foto lanza BadRequestException', async () => {
    await expect(controller.resolve('id-1', undefined)).rejects.toThrow(BadRequestException);
  });

  it('resolve busca el reporte ANTES de subir la foto (si no existe, no se sube nada)', async () => {
    reportsService.findOne.mockRejectedValue(new Error('404'));

    await expect(controller.resolve('id-1', foto)).rejects.toThrow('404');
    expect(storageService.uploadFile).not.toHaveBeenCalled();
  });
});
