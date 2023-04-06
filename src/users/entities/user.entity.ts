import { Column, Entity } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';

@Entity('users')
export class User extends CommonEntity {
  @Column({
    type: 'float',
    nullable: true,
  })
  balance: number | null;

  @Column()
  nickname: string;

  @Column()
  email: string;

  @Column({
    type: 'numeric',
  })
  requestCount: number;

  public incrementRequest() {}
}
