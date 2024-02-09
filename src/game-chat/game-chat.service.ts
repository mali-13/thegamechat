import { Injectable } from '@nestjs/common'
import { FindManyOptions, Repository } from 'typeorm'
import { GameChat } from './game-chat.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class GameChatService {
  constructor(
    @InjectRepository(GameChat)
    private readonly gameChatRepository: Repository<GameChat>,
  ) {}

  async find(options: FindManyOptions<GameChat>) {
    return this.gameChatRepository.find(options)
  }

  async save(gameChat: GameChat) {
    return this.gameChatRepository.save(gameChat)
  }
}
