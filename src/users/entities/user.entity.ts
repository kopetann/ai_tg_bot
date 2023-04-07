import { Column, Entity } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';
import { UserRoleEnum } from '../enums/user.role.enum';

@Entity('users')
export class User extends CommonEntity {
  @Column({
    type: 'float',
    default: 0.0,
  })
  balance: number;

  @Column()
  nickName: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.USER,
  })
  role: keyof UserRoleEnum;

  @Column({
    type: 'numeric',
  })
  requestCount: number;

  @Column({ nullable: true })
  email: string | null;

  public incrementRequest() {}
}
