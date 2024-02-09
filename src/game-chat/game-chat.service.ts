import { Injectable } from '@nestjs/common'
import { FindManyOptions, Repository } from 'typeorm'
import { GameChat } from './game-chat.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Mattermost } from '../mattermost/mattermost.service'
import { Challenge } from '../challenge/challenge.entity'
import { TeamService } from '../team/team.service'
import { uuid } from 'short-uuid'

@Injectable()
export class GameChatService {
  constructor(
    @InjectRepository(GameChat)
    private readonly gameChatRepository: Repository<GameChat>,
    private readonly teamService: TeamService,
    private readonly mattermost: Mattermost,
  ) {}

  async create(challenge: Challenge) {
    const challenger = await this.teamService.findOne({
      where: { teamId: challenge.challengerTeamId },
      relations: {
        players: true,
      },
    })

    const challenged = await this.teamService.findOne({
      where: { teamId: challenge.challengedTeamId },
      relations: {
        players: true,
      },
    })

    const gameChat = new GameChat()
    gameChat.challengerTeamId = challenge.challengerTeamId
    gameChat.challengedTeamId = challenge.challengedTeamId

    const channelName =
      challenger.name.replaceAll(' ', '-').toLowerCase() +
      '-' +
      challenged.name.replaceAll(' ', '-').toLowerCase() +
      '-' +
      uuid()

    const channelDisplayName = challenger.name + ' vs ' + challenged.name

    const channel = await this.mattermost.createChannel(
      // @ts-expect-error send only required values
      {
        team_id: this.mattermost.config.teamId,
        name: channelName,
        display_name: channelDisplayName,
        type: 'P',
      },
    )

    gameChat.channelId = channel.id

    return await this.gameChatRepository.save(gameChat)
  }

  async find(options: FindManyOptions<GameChat>) {
    return this.gameChatRepository.find(options)
  }
}
