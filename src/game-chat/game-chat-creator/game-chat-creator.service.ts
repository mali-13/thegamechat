import { Injectable } from '@nestjs/common'
import { uuid } from 'short-uuid'
import { Mattermost } from '../../mattermost/mattermost.service'
import { Challenge } from '../../challenge/challenge.entity'
import { GameChat } from '../game-chat.entity'
import { TeamService } from '../../team/team.service'
import { GameChatService } from '../game-chat.service'
import { TeamChannelSync } from '../../team-channel-sync/team-channel-sync'

@Injectable()
export class GameChatCreatorService {
  constructor(
    private readonly teamService: TeamService,
    private readonly gameChatService: GameChatService,
    private readonly mattermost: Mattermost,
    private readonly teamChannelSync: TeamChannelSync,
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

    const created = await this.gameChatService.save(gameChat)

    await this.teamChannelSync.syncGameChats(challenger.teamId)

    return created
  }
}
