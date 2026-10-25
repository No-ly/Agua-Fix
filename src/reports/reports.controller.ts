import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ReportsService } from './reports.service';
import { CreateReportDto } from './dtos/create-report.dto';
import { StorageService } from '../storage/storage.service';

// Máximo 5 MB y solo archivos de imagen. Si el archivo no es imagen, multer lo descarta
// y el controller recibe `undefined`, que se rechaza abajo con un 400 claro.
const imageInterceptor = (fieldName: string) =>
  FileInterceptor(fieldName, {
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => cb(null, file.mimetype.startsWith('image/')),
  });

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly storageService: StorageService,
  ) {}

  @Post()
  @UseInterceptors(imageInterceptor('photo'))
  async createReport(
    @Body() createReportDto: CreateReportDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    if (!photo) {
      throw new BadRequestException(
        'La foto de la fuga es obligatoria (campo "photo", tipo imagen)',
      );
    }

    const photoUrl = await this.storageService.uploadFile(photo, 'reports');
    return this.reportsService.create(createReportDto, photoUrl);
  }

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  // La cuadrilla cierra el reporte subiendo la foto del trabajo terminado
  @Patch(':id/resolve')
  @UseInterceptors(imageInterceptor('repairPhoto'))
  async resolve(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() repairPhoto?: Express.Multer.File,
  ) {
    if (!repairPhoto) {
      throw new BadRequestException(
        'La foto del trabajo terminado es obligatoria (campo "repairPhoto", tipo imagen)',
      );
    }

    const report = await this.reportsService.findOne(id); // 404 si no existe, antes de subir nada
    const repairPhotoUrl = await this.storageService.uploadFile(repairPhoto, 'repairs');
    return this.reportsService.resolve(report, repairPhotoUrl);
  }
}
