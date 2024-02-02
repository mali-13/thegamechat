import { Module } from '@nestjs/common'
import { TeamChallengeService } from './team-challenge.service'
import { ChallengeModule } from '../../challenge/challenge.module'
import { TeamChallengeController } from './team-challenge.controller'

@Module({
  controllers: [TeamChallengeController],
  providers: [TeamChallengeService],
  imports: [ChallengeModule],
  exports: [TeamChallengeService],
})
export class TeamChallengeModule {}
