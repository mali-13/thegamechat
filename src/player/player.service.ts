import { Injectable } from '@nestjs/common'
import { FindManyOptions, Repository } from 'typeorm'
import { Player } from './player.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { CreatePlayerDto } from './player.dto'

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  savePlayer(playerDto: CreatePlayerDto) {
    const player = new Player()
    player.name = playerDto.name
    return this.playerRepository.save(player)
  }

  findPlayers(options: FindManyOptions<Player>) {
    return this.playerRepository.find(options)
  }

  findOneBy(playerId: number) {
    return this.playerRepository.findOneBy({ playerId })
  }
}
