import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Report } from './entities/report.entity';
import { User } from '../auth/entities/user.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { EmailService } from '../email/email.service';
import { envs } from '../config/envs';
import { generateReportTemplate } from './templates/report.template';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
  ) {}

  async create(createReportDto: CreateReportDto, photoUrl: string): Promise<Report> {
    // 1. Guardar el reporte (con la URL de la foto) en la base de datos
    const report = this.reportRepository.create({ ...createReportDto, photoUrl });
    const savedReport = await this.reportRepository.save(report);

    // 2. Destinatarios: la cuadrilla más los usuarios que activaron notificaciones.
    //    Un Set evita mandar el mismo correo dos veces si la cuadrilla también es usuario.
    const usersToNotify = await this.userRepository.findBy({ isNotificationEnabled: true });
    const recipientEmails = new Set<string>([envs.MAINTENANCE_CREW_EMAIL]);
    usersToNotify.forEach((user) => recipientEmails.add(user.email));

    // 3. Correo con la foto. No se espera: si falla, el reporte ya quedó guardado.
    this.emailService
      .sendMail({
        to: Array.from(recipientEmails).join(', '),
        subject: `🚨 Nueva fuga de agua reportada [Gravedad: ${createReportDto.severity.toUpperCase()}]`,
        html: generateReportTemplate(createReportDto, photoUrl),
      })
      .catch((err) => console.error('Error al enviar la alerta de correo:', err));

    return savedReport;
  }

  findAll(): Promise<Report[]> {
    return this.reportRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Report> {
    const report = await this.reportRepository.findOneBy({ id });
    if (!report) {
      throw new NotFoundException(`No existe un reporte con id ${id}`);
    }
    return report;
  }

  resolve(report: Report, repairPhotoUrl: string): Promise<Report> {
    report.isResolved = true;
    report.repairPhotoUrl = repairPhotoUrl;
    return this.reportRepository.save(report);
  }
}
