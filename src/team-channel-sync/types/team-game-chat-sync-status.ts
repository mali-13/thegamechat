import { Team } from '../../team/team.entity'
import { StatusOK } from '@mattermost/types/client4'
import { RecursivePartial } from '../../coomon/recursive-partial'
import { GameChat } from '../../game-chat/game-chat.entity'
import {
  AddedMember,
  RemovedMember,
  TeamPlayer,
} from './team-channel-sync-status'
import { ChannelMembership } from '@mattermost/types/channels'

export type GameChatSyncStatus = {
  gameChatId: number
  challengerTeam: RecursivePartial<Team>
  challengedTeam: RecursivePartial<Team>
  channelId: string
  channelMembershipUserIds: string[]
  added: AddedMember[]
  removed: RemovedMember[]
  synced: Date
}

export type TeamGameChatSyncStatus = {
  teamId: number
  teamName: string
  teamPlayers: TeamPlayer[]
  gameChatSyncStatuses: GameChatSyncStatus[]
  synced: Date
}

export class GameChatSyncStatusBuilder {
  private readonly gameChatSyncStatus: GameChatSyncStatus

  constructor(
    addStatuses: ChannelMembership[],
    removeStatuses: StatusOK[],
    channelMembershipUserIds: string[],
    newMemberIds: string[],
    oldMemberIds: string[],
    gameChat: GameChat,
    challengerTeam: Team,
    challengedTeam: Team,
  ) {
    const challenger = {
      teamId: challengerTeam.teamId,
      name: challengerTeam.name,
      players: challengerTeam.players.map((player) => ({
        playerId: player.playerId,
        mattermostUserId: player.mattermostUserId,
      })),
    }

    const challenged = {
      teamId: challengedTeam.teamId,
      name: challengedTeam.name,
      players: challengedTeam.players.map((player) => ({
        playerId: player.playerId,
        mattermostUserId: player.mattermostUserId,
      })),
    }

    const players = [...challengerTeam.players, ...challengedTeam.players]

    const added = newMemberIds.map((newMemberId) => {
      const player = players.find(
        (player) => player.mattermostUserId === newMemberId,
      )

      const addStatus = addStatuses.find(
        (channelMembership) => channelMembership.user_id === newMemberId,
      )

      return {
        playerId: player.playerId,
        mattermostUserId: player.mattermostUserId,
        channelMembership: addStatus ? addStatus.user_id : 'ERROR',
      }
    })

    const removed = oldMemberIds.map((oldMemberId, index) => {
      const removeStatus = removeStatuses[index]?.status || 'ERROR'

      return {
        mattermostUserId: oldMemberId,
        removeStatus: removeStatus,
      }
    })

    const synced = new Date()

    this.gameChatSyncStatus = {
      channelId: gameChat.channelId,
      gameChatId: gameChat.gameChatId,
      challengerTeam: challenger,
      challengedTeam: challenged,
      channelMembershipUserIds,
      added,
      removed,
      synced,
    }
  }

  build(): GameChatSyncStatus {
    return this.gameChatSyncStatus
  }
}

export class TeamGameChatSyncStatusBuilder {
  private readonly teamGameChatSyncStatus: TeamGameChatSyncStatus

  constructor(team: Team) {
    const teamPlayers = team.players.map((player) => ({
      playerId: player.playerId,
      mattermostUserId: player.mattermostUserId,
    }))

    const synced = new Date()

    this.teamGameChatSyncStatus = {
      teamId: team.teamId,
      teamName: team.name,
      teamPlayers,
      gameChatSyncStatuses: [],
      synced,
    }
  }

  gameChatSyncStatuses(gameChatSyncStatuses: GameChatSyncStatus[]) {
    this.teamGameChatSyncStatus.gameChatSyncStatuses = gameChatSyncStatuses
    return this
  }

  build(): TeamGameChatSyncStatus {
    return this.teamGameChatSyncStatus
  }
}
