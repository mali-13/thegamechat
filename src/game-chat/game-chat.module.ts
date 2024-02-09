import { Module } from '@nestjs/common'
import { GameChatService } from './game-chat.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GameChat } from './game-chat.entity'

@Module({
  imports: [TypeOrmModule.forFeature([GameChat])],
  providers: [GameChatService],
  exports: [GameChatService],
})
export class GameChatModule {}
