import { Column, Entity } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';
import { UserRoleEnum } from '../enums/user.role.enum';

@Entity('users')
export class User extends CommonEntity {
  @Column()
  userName: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.USER,
  })
  role: keyof UserRoleEnum;

  @Column({
    type: 'numeric',
    nullable: true,
  })
  requestCount: number | null;

  @Column({
    type: 'interval',
    nullable: true,
  })
  subscriptionDate: Date | null;

  public decrementRequest() {}
}
