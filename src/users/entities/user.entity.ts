import { Entity } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';

@Entity('users')
export class User extends CommonEntity {}
