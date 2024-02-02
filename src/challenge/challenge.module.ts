import { Module } from '@nestjs/common'
import { ChallengeService } from './challenge.service'
import { ChallengeController } from './challenge.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Challenge } from './challenge.entity'
import { TeamModule } from '../team/team.module'

@Module({
  controllers: [ChallengeController],
  providers: [ChallengeService],
  imports: [TypeOrmModule.forFeature([Challenge]), TeamModule],
  exports: [ChallengeService],
})
export class ChallengeModule {}
