import { INestApplication } from '@nestjs/common'
import { Repository } from 'typeorm'
import {
  Challenge,
  ChallengeStatus,
} from '../../../src/challenge/challenge.entity'
import { getRepositoryToken } from '@nestjs/typeorm'

const defaultChallenge: Partial<Challenge> = {
  challengerTeamId: 1,
  challengedTeamId: 2,
  message: `Are you up for a game?`,
  status: ChallengeStatus.PENDING,
  madeOn: new Date(),
}

export function createChallenge(
  challenge: Partial<Challenge>,
  app: INestApplication,
) {
  const challengeRepository = app.get<Repository<Challenge>>(
    getRepositoryToken(Challenge),
  )

  return challengeRepository.save({
    ...defaultChallenge,
    ...challenge,
  })
}
