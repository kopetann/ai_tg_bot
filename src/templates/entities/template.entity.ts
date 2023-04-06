import { Column, Entity } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';

@Entity('template')
export class Template extends CommonEntity {
  @Column({
    type: 'varchar',
  })
  text: string;

  @Column()
  eventType: string;
}
