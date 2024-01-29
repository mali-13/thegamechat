import { Inject, Injectable } from '@nestjs/common'
import { FindManyOptions, Repository } from 'typeorm'
import { Player } from './player.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { CreatePlayerDto } from './player.dto'
import { Client4 as Mattermost } from '@mattermost/client'

@Injectable()
export class PlayerService {
  constructor(
    @Inject('Mattermost')
    private readonly mattermost: Mattermost,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async savePlayer(playerDto: CreatePlayerDto) {
    try {
      const mattermostUser = await this.mattermost.createUser(
        // @ts-ignore
        {
          email: `${playerDto.name}@generated.com`,
          username: `${playerDto.name}`,
          password: '12345Mm',
        },
        '',
        '',
      )

      console.log(mattermostUser)
    } catch (err) {
      console.log(err)
    }

    const player = new Player()
    player.name = playerDto.name
    // const savedPlayer = await this.playerRepository.save(player)
    return null
  }

  findPlayers(options: FindManyOptions<Player>) {
    return this.playerRepository.find(options)
  }

  findOneBy(playerId: number) {
    return this.playerRepository.findOneBy({ playerId })
  }
}
