import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserTypeOrmRepository } from './infrastructures/user.typeorm.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infrastructures/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'UserRepository',
      useClass: UserTypeOrmRepository,
    },
  ],
})
export class UserModule {}
