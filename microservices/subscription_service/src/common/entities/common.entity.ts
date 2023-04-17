import {
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export abstract class CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
