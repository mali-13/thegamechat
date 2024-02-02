import { Module } from '@nestjs/common'
import { ChallengeService } from './challenge.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Challenge } from './challenge.entity'
import { TeamModule } from '../team/team.module'

@Module({
  providers: [ChallengeService],
  imports: [TypeOrmModule.forFeature([Challenge]), TeamModule],
  exports: [ChallengeService],
})
export class ChallengeModule {}
