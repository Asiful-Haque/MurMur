import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { User } from './entities/user.entity';
import { Murmur } from './entities/murmur.entity';
import { MurmursModule } from './murmur/murmur.module';
import { FollowModule } from './follow/follow.module';
import { TimelineModule } from './timeline/timeline.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'docker',
      password: 'docker',
      database: 'test',
      entities: [User, Murmur],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Murmur]),
    MurmursModule,
    FollowModule,
    TimelineModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
