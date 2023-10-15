import { Column, Entity } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';
import { config } from '../../common/config';
import { User, UserRole } from 'ai_tg_bot_proto';

@Entity('users')
export class UserEntity extends CommonEntity implements User {
  @Column()
  extId: number;

  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({ nullable: true, type: 'varchar' })
  userName: string | undefined;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.user,
  })
  role: UserRole;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  subscriptionDate: string | undefined;

  @Column({
    default: config.get<number>('MAX_FREE_REQUESTS', 10),
  })
  freeRequests: number;
}
