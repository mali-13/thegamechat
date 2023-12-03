import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { Player } from './player.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { PlayerDto } from './player.dto'

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  savePlayer(playerDto: PlayerDto) {
    const player = new Player()
    player.name = playerDto.name
    return this.playerRepository.save(player)
  }

  findPlayers() {
    return this.playerRepository.find()
  }

  findOneBy(playerId: number) {
    return this.playerRepository.findOneBy({ playerId })
  }
}
