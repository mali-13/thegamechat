import { TeamChannelSyncStatus, TeamPlayer } from './team-channel-sync-status'
import { TeamGameChatSyncStatus } from './team-game-chat-sync-status'
import { Team } from '../../team/team.entity'

export class SyncStatusBuilder {
  private readonly syncStatus: SyncStatus

  constructor(
    teamChannelSyncStatus: TeamChannelSyncStatus,
    teamGameChatSyncStatus: TeamGameChatSyncStatus,
    team: Team,
  ) {
    const teamPlayers = team.players.map((player) => ({
      playerId: player.playerId,
      mattermostUserId: player.mattermostUserId,
    }))

    const synced = new Date()

    this.syncStatus = {
      teamId: team.teamId,
      teamName: team.name,
      teamPlayers,
      teamChannelSyncStatus,
      teamGameChatSyncStatus,
      synced,
    }
  }

  build(): SyncStatus {
    return this.syncStatus
  }
}

export type SyncStatus = {
  teamId: number
  teamName: string
  teamPlayers: TeamPlayer[]
  teamChannelSyncStatus: TeamChannelSyncStatus
  teamGameChatSyncStatus: TeamGameChatSyncStatus
  synced: Date
}
