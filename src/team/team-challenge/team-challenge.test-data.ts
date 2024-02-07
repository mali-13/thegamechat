import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { Challenge, ChallengeStatus } from '../../challenge/challenge.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class TeamChallengeTestData {
  defaultChallenge: Partial<Challenge> = {
    challengerTeamId: 1,
    challengedTeamId: 2,
    message: `Are you up for a game?`,
    status: ChallengeStatus.PENDING,
    madeOn: new Date(),
  }

  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
  ) {}

  createChallenge(challenge: Partial<Challenge>) {
    return this.challengeRepository.save({
      ...this.defaultChallenge,
      ...challenge,
    })
  }
}
