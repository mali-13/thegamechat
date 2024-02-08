import { Team } from '../../team/team.entity'
import { StatusOK } from '@mattermost/types/client4'

export class TeamChannelSyncStatusBuilder {
  private readonly teamChannelSyncStatus: TeamChannelSyncStatus

  constructor(
    addStatuses: ChannelMembership[],
    removeStatuses: StatusOK[],
    channelMemberships: ChannelMembership[],
    newMemberIds: string[],
    oldMemberIds: string[],
    team: Team,
  ) {
    const teamPlayers = team.players.map((player) => ({
      playerId: player.playerId,
      mattermostUserId: player.mattermostUserId,
    }))

    const channelMembershipUserIds = channelMemberships.map(
      (channelMembership) => channelMembership.user_id,
    )

    const added = newMemberIds.map((newMemberId) => {
      const player = team.players.find(
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

    this.teamChannelSyncStatus = {
      teamId: team.teamId,
      teamName: team.name,
      teamChannelId: team.channelId,
      teamPlayers,
      channelMembershipUserIds,
      added,
      removed,
      synced,
    }
  }

  build(): TeamChannelSyncStatus {
    return this.teamChannelSyncStatus
  }
}

export type ChannelMembership = {
  user_id: string
}

export type TeamPlayer = {
  playerId: number
  mattermostUserId: string
}

export type AddedMember = {
  playerId: number
  mattermostUserId: string
  channelMembership: string
}

export type RemovedMember = {
  mattermostUserId: string
  removeStatus: string
}

export type TeamChannelSyncStatus = {
  teamId: number
  teamName: string
  teamChannelId: string
  teamPlayers: TeamPlayer[]
  channelMembershipUserIds: string[]
  added: AddedMember[]
  removed: RemovedMember[]
  synced: Date
}
