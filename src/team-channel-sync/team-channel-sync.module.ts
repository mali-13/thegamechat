import { Module } from '@nestjs/common'
import { TeamChannelSync } from './team-channel-sync'
import { GameChatModule } from '../game-chat/game-chat.module'
import { TeamModule } from '../team/team.module'

@Module({
  imports: [GameChatModule, TeamModule],
  providers: [TeamChannelSync],
  exports: [TeamChannelSync],
})
export class TeamChannelSyncModule {}
