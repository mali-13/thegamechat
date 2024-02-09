import { Module } from '@nestjs/common'
import { GameChatService } from './game-chat.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GameChat } from './game-chat.entity'
import { MattermostModule } from '../mattermost/mattermost.module'
import { TeamModule } from '../team/team.module'

@Module({
  imports: [TypeOrmModule.forFeature([GameChat]), TeamModule, MattermostModule],
  providers: [GameChatService],
  exports: [GameChatService],
})
export class GameChatModule {}
