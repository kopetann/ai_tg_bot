import { Column, Entity } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';
import { config } from '../../common/config';
import { User, UserRole } from '../../proto/build/user.pb';

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
    type: 'numeric',
    nullable: true,
  })
  requestCount: number | undefined;

  @Column({
    type: 'interval',
    nullable: true,
  })
  subscriptionDate: number | undefined;

  @Column({
    default: config.get<number>('MAX_FREE_REQUESTS', 10),
  })
  freeRequests: number;
}
