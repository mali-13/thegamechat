import { Module } from '@nestjs/common'
import { PlayerModule } from './player/player.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TeamModule } from './team/team.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '111222',
      database: 'the_game_chat',
      autoLoadEntities: true,
      synchronize: true,
    }),
    PlayerModule,
    TeamModule,
  ],
})
export class AppModule {}
