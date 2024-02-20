import { Injectable } from '@nestjs/common'
import { FindManyOptions, Repository } from 'typeorm'
import { Player } from './player.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Mattermost } from '../mattermost/mattermost.service'

@Injectable()
export class PlayerService {
  constructor(
    private readonly mattermost: Mattermost,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async save(player: Player) {
    return await this.playerRepository.save(player)
  }

  findPlayers(options: FindManyOptions<Player>) {
    return this.playerRepository.find(options)
  }

  findOneBy(playerId: number) {
    return this.playerRepository.findOneBy({ playerId })
  }
}
