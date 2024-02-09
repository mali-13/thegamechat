import { Module } from '@nestjs/common'

import { GameChatCreatorService } from './game-chat-creator.service'
import { TeamModule } from '../../team/team.module'
import { MattermostModule } from '../../mattermost/mattermost.module'
import { GameChatModule } from '../game-chat.module'
import { TeamChannelSyncModule } from '../../team-channel-sync/team-channel-sync.module'

@Module({
  imports: [
    TeamModule,
    GameChatModule,
    MattermostModule,
    TeamChannelSyncModule,
  ],
  providers: [GameChatCreatorService],
  exports: [GameChatCreatorService],
})
export class GameChatCreatorModule {}
