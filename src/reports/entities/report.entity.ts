import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('WATER_REPORT')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  address!: string;

  @Column()
  description!: string;

  @Column({ type: 'varchar', default: 'medium' })
  severity!: 'low' | 'medium' | 'high';

  @Column()
  reporterPhone!: string;

  @Column({ default: false })
  isResolved!: boolean;

  // Nullable porque los reportes del primer parcial se crearon sin foto
  @Column({ type: 'varchar', nullable: true })
  photoUrl!: string | null;

  @Column({ type: 'varchar', nullable: true })
  repairPhotoUrl!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
