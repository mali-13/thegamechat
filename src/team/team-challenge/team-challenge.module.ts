import { Module } from '@nestjs/common'
import { TeamChallengeService } from './team-challenge.service'
import { ChallengeModule } from '../../challenge/challenge.module'
import { TeamChallengeController } from './team-challenge.controller'
import { GameChatModule } from '../../game-chat/game-chat.module'
import { GameChatCreatorModule } from '../../game-chat/game-chat-creator/game-chat-creator.module'

@Module({
  controllers: [TeamChallengeController],
  providers: [TeamChallengeService],
  imports: [ChallengeModule, GameChatModule, GameChatCreatorModule],
  exports: [TeamChallengeService],
})
export class TeamChallengeModule {}
