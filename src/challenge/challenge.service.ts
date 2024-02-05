import { Injectable, NotFoundException } from '@nestjs/common'
import { ChallengeDto } from './challenge.dto'
import { TeamService } from '../team/team.service'
import { Challenge, ChallengeStatus } from './challenge.entity'
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class ChallengeService {
  constructor(
    private readonly teamService: TeamService,
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
  ) {}

  create(challengeDto: ChallengeDto) {
    const challengerTeam = this.teamService.findOne({
      where: { teamId: challengeDto.challengerTeamId },
    })

    if (!challengerTeam) {
      throw new NotFoundException(
        `Challenger not found! The challenger team with id ${challengeDto.challengedTeamId} was not found`,
      )
    }

    const challengedTeam = this.teamService.findOne({
      where: { teamId: challengeDto.challengedTeamId },
    })

    if (!challengedTeam) {
      throw new NotFoundException(
        `Challenged not found! The challenged team with id ${challengeDto.challengedTeamId} was not found`,
      )
    }

    const challenge = new Challenge()
    challenge.challengerTeamId = challengeDto.challengerTeamId
    challenge.challengedTeamId = challengeDto.challengedTeamId
    challenge.status = ChallengeStatus.PENDING
    challenge.message = challengeDto.message

    return this.challengeRepository.save(challenge)
  }

  find(options: FindManyOptions<Challenge>) {
    return this.challengeRepository.find(options)
  }

  findOne(options: FindOneOptions) {
    return this.challengeRepository.findOne(options)
  }

  save(challenge: Challenge) {
    return this.challengeRepository.save(challenge)
  }
}
