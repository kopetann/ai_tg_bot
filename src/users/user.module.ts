import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';

@Module({
  controllers: [],
  providers: [UserService],
  exports: [UserService],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UserModule {}
