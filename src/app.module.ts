import { Module, ValidationPipe } from '@nestjs/common'
import { PlayerModule } from './player/player.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TeamModule } from './team/team.module'
import { TeamInviteCodeModule } from './team/team-invite-code/team-invite-code.module'
import { MattermostModule } from './mattermost/mattermost.module'
import { ConfigModule } from '@nestjs/config'
import mattermostConfig from './mattermost/mattermost.config'
import { ChallengeModule } from './challenge/challenge.module'
import { TeamChallengeModule } from './team/team-challenge/team-challenge.module'
import { APP_PIPE } from '@nestjs/core'
import { GameChatModule } from './game-chat/game-chat.module'
import { TeamChannelSyncModule } from './team-channel-sync/team-channel-sync.module'
import { TeamPlayerEditHandlerModule } from './team/team-player/team-player-edit-handler/team-player-edit-handler.module'
import { TeamCreatorModule } from './team/team-creator/team-creator.module'
import { PlayerCreatorModule } from './player/player-creator/player-creator.module'

@Module({
  imports: [
    PlayerModule,
    PlayerCreatorModule,
    TeamModule,
    TeamInviteCodeModule,
    TeamChallengeModule,
    TeamChannelSyncModule,
    TeamPlayerEditHandlerModule,
    TeamCreatorModule,
    MattermostModule,
    ChallengeModule,
    GameChatModule,
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
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mattermostConfig],
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    },
  ],
})
export class AppModule {}
