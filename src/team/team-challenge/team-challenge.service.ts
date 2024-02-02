import { Injectable } from '@nestjs/common'
import { ChallengeService } from '../../challenge/challenge.service'
import { ChallengeDto } from '../../challenge/challenge.dto'

@Injectable()
export class TeamChallengeService {
  constructor(private readonly challengeService: ChallengeService) {}

  create(challengeDto: ChallengeDto) {
    return this.challengeService.create(challengeDto)
  }

  find(teamId: number) {
    return this.challengeService.find({ where: { challengerTeamId: teamId } })
  }
}
