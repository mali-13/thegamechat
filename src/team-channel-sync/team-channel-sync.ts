import { Injectable } from '@nestjs/common'
import { TeamService } from '../team/team.service'
import { GameChatService } from '../game-chat/game-chat.service'
import { Mattermost } from '../mattermost/mattermost.service'
import { In } from 'typeorm'
import * as _ from 'lodash'
import { TeamChannelSyncStatusBuilder } from './types/team-channel-sync-status'
import {
  GameChatSyncStatusBuilder,
  TeamGameChatSyncStatusBuilder,
} from './types/team-game-chat-sync-status'
import { SyncStatusBuilder } from './types/sync-status'

@Injectable()
export class TeamChannelSync {
  constructor(
    private readonly teamService: TeamService,
    private readonly gameChatService: GameChatService,
    private readonly mattermost: Mattermost,
  ) {}

  async sync(teamId: number) {
    const team = await this.teamService.findOne({
      where: { teamId },
      relations: {
        players: true,
      },
    })

    const teamChannelSyncStatus = await this.syncTeamChannel(teamId)
    const teamGameChatSyncStatus = await this.syncGameChats(teamId)

    const syncStatus = new SyncStatusBuilder(
      teamChannelSyncStatus,
      teamGameChatSyncStatus,
      team,
    ).build()

    return syncStatus
  }

  async syncGameChats(teamId: number) {
    const gameChats = await this.gameChatService.find({
      where: [{ challengerTeamId: teamId }, { challengedTeamId: teamId }],
    })

    const teamIds = gameChats.reduce((teamIds, gameChat) => {
      teamIds.add(gameChat.challengerTeamId)
      teamIds.add(gameChat.challengedTeamId)
      return teamIds
    }, new Set<number>())

    const teams = await this.teamService.find({
      where: {
        teamId: In([...teamIds]),
      },
      relations: {
        players: true,
      },
    })

    const team = teams.find((team) => team.teamId === teamId)

    const gameChatChannelIds = gameChats.map((gameChat) => gameChat.channelId)

    const channelMemberships = await Promise.all(
      gameChatChannelIds.map((channelId) =>
        this.mattermost.getChannelMembers(channelId),
      ),
    )

    const channelIdToMemberIds = channelMemberships.reduce(
      (channelIdToMemberIds, channelMemberships) => {
        const channelId = channelMemberships[0].channel_id

        const memberIds = channelMemberships.map(
          (channelMembership) => channelMembership.user_id,
        )

        channelIdToMemberIds.set(channelId, memberIds)
        return channelIdToMemberIds
      },
      new Map<string, string[]>(),
    )

    const channelIdToNewMemberIds = gameChats.reduce(
      (channelIdToNewMemberIds, gameChat) => {
        const memberIds = channelIdToMemberIds.get(gameChat.channelId)

        const challengerPlayerIds = teams
          .find((team) => team.teamId === gameChat.challengerTeamId)
          .players.map((player) => player.mattermostUserId)

        const challengedPlayerIds = teams
          .find((team) => team.teamId === gameChat.challengedTeamId)
          .players.map((player) => player.mattermostUserId)

        const newMemberIds = _.difference(
          [...challengerPlayerIds, ...challengedPlayerIds],
          memberIds,
        )
        channelIdToNewMemberIds.set(gameChat.channelId, newMemberIds)
        return channelIdToNewMemberIds
      },
      new Map<string, string[]>(),
    )

    const channelIdToOldMemberIds = gameChats.reduce(
      (channelIdToNewMemberIds, gameChat) => {
        const memberIds = channelIdToMemberIds.get(gameChat.channelId)

        const challengerPlayerIds = teams
          .find((team) => team.teamId === gameChat.challengerTeamId)
          .players.map((player) => player.mattermostUserId)

        const challengedPlayerIds = teams
          .find((team) => team.teamId === gameChat.challengedTeamId)
          .players.map((player) => player.mattermostUserId)

        const oldMemberIds = _.difference(memberIds, [
          ...challengerPlayerIds,
          ...challengedPlayerIds,
        ])
        channelIdToNewMemberIds.set(gameChat.channelId, oldMemberIds)
        return channelIdToNewMemberIds
      },
      new Map<string, string[]>(),
    )

    const gameChatSyncStatuses = await Promise.all(
      gameChats.map(async (gameChat) => {
        const challengerTeam = teams.find(
          (team) => team.teamId === gameChat.challengerTeamId,
        )
        const challengedTeam = teams.find(
          (team) => team.teamId === gameChat.challengedTeamId,
        )

        const chanelMembershipUserIds = channelIdToMemberIds.get(
          gameChat.channelId,
        )

        const newMemberIds = channelIdToNewMemberIds.get(gameChat.channelId)
        const oldMemberIds = channelIdToOldMemberIds.get(gameChat.channelId)

        const addStatuses = await Promise.all(
          newMemberIds.map((newMemberId) =>
            this.mattermost.addToChannel(newMemberId, gameChat.channelId),
          ),
        )

        const removeStatuses = await Promise.all(
          oldMemberIds.map((oldMemberId) =>
            this.mattermost.removeFromChannel(oldMemberId, gameChat.channelId),
          ),
        )

        return new GameChatSyncStatusBuilder(
          addStatuses,
          removeStatuses,
          chanelMembershipUserIds,
          newMemberIds,
          oldMemberIds,
          gameChat,
          challengerTeam,
          challengedTeam,
        ).build()
      }),
    )

    const teamGameChatSyncStatuses = new TeamGameChatSyncStatusBuilder(
      team,
      gameChatSyncStatuses,
    ).build()

    return teamGameChatSyncStatuses
  }

  async syncTeamChannel(teamId: number) {
    const team = await this.teamService.findOne({
      where: { teamId },
      relations: {
        players: true,
      },
    })

    const teamPlayersIds = team.players.map((player) => player.mattermostUserId)

    const channelMemberships = await this.mattermost.getChannelMembers(
      team.channelId,
    )

    const memberIds = channelMemberships.map(
      (channelMembership) => channelMembership.user_id,
    )

    const newMemberIds = _.difference(teamPlayersIds, memberIds)
    const oldMemberIds = _.difference(memberIds, teamPlayersIds)

    const addStatuses = await Promise.all(
      newMemberIds.map((newMemberId) =>
        this.mattermost.addToChannel(newMemberId, team.channelId),
      ),
    )

    const removeStatuses = await Promise.all(
      oldMemberIds.map((oldMemberId) =>
        this.mattermost.removeFromChannel(oldMemberId, team.channelId),
      ),
    )
    const teamChannelSyncStatus = new TeamChannelSyncStatusBuilder(
      addStatuses,
      removeStatuses,
      channelMemberships,
      newMemberIds,
      oldMemberIds,
      team,
    ).build()

    return teamChannelSyncStatus
  }
}
