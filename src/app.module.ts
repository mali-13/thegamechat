import { Module } from '@nestjs/common'
import { PlayerModule } from './player/player.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TeamModule } from './team/team.module'
import { TeamInviteCodeModule } from './team/team-invite-code/team-invite-code.module'
import { MattermostModule } from './mattermost/mattermost.module'
import { ConfigModule } from '@nestjs/config'
import mattermostConfig from './mattermost/mattermost.config'

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
    TeamInviteCodeModule,
    MattermostModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mattermostConfig],
    }),
  ],
})
export class AppModule {}
