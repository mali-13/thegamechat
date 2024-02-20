import { Injectable } from '@nestjs/common'
import { Mattermost } from '../../mattermost/mattermost.service'
import { CreatePlayerDto } from '../player.dto'
import { uuid } from 'short-uuid'
import { Player } from '../player.entity'
import { PlayerService } from '../player.service'

@Injectable()
export class PlayerCreatorService {
  constructor(
    private readonly playerService: PlayerService,
    private readonly mattermost: Mattermost,
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

    await this.mattermost.addUsersToTeam(this.mattermost.config.teamId, [
      mattermostUser.id,
    ])

    const player = new Player()
    player.name = playerDto.name
    player.mattermostUserId = mattermostUser.id
    return await this.playerService.save(player)
  }
}
