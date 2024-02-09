import { forwardRef, Module } from '@nestjs/common'
import { TeamChannelSync } from './team-channel-sync'
import { GameChatModule } from '../game-chat/game-chat.module'
import { TeamModule } from '../team/team.module'

@Module({
  imports: [forwardRef(() => TeamModule), GameChatModule],
  providers: [TeamChannelSync],
  exports: [TeamChannelSync],
})
export class TeamChannelSyncModule {}
