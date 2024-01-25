import { Injectable, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { Team } from '../team.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { InviteCode } from './invite-code.entity'
import { generate as uuid } from 'short-uuid'

@Injectable()
export class TeamInviteCodeService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async findInviteCodes(teamId: number) {
    const team = await this.teamRepository.findOne({
      where: { teamId },
      relations: {
        inviteCodes: true,
      },
    })

    if (!team) {
      throw new NotFoundException(
        'Team not found. The provided team was not found',
      )
    }

    return team.inviteCodes
  }

  async addInviteCode(teamId: number) {
    const team = await this.teamRepository.findOne({
      where: { teamId },
      relations: {
        inviteCodes: true,
      },
    })

    if (!team) {
      throw new NotFoundException(
        'Team not found. The provided team was not found',
      )
    }

    const inviteCode = new InviteCode()
    inviteCode.created = new Date()
    inviteCode.code = uuid()

    team.inviteCodes.push(inviteCode)

    await this.teamRepository.save(team)

    return inviteCode
  }
}
