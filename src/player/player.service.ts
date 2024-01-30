import { Injectable } from '@nestjs/common'
import { FindManyOptions, Repository } from 'typeorm'
import { Player } from './player.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { CreatePlayerDto } from './player.dto'
import { uuid } from 'short-uuid'
import { Mattermost } from '../mattermost.module'

@Injectable()
export class PlayerService {
  constructor(
    private readonly mattermost: Mattermost,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async savePlayer(playerDto: CreatePlayerDto) {
    const username = `${playerDto.name}-${uuid()}`

    const mattermostUser = await this.mattermost.createUser(
      // @ts-expect-error send only required fields
      {
        email: `${username}@generated.com`,
        username: `${username}`,
        password: playerDto.password,
      },
      '',
      '',
    )

    const player = new Player()
    player.name = playerDto.name
    player.mattermostUserId = mattermostUser.id
    return await this.playerRepository.save(player)
  }

  findPlayers(options: FindManyOptions<Player>) {
    return this.playerRepository.find(options)
  }

  findOneBy(playerId: number) {
    return this.playerRepository.findOneBy({ playerId })
  }
}
