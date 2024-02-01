import { Module } from '@nestjs/common'
import { TeamController } from './team.controller'
import { TeamService } from './team.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Team } from './team.entity'
import { PlayerModule } from '../player/player.module'
import { TeamCreatorService } from './team-creator.service'
import { TeamPlayerService } from './team-player/team-player.service'

@Module({
  imports: [TypeOrmModule.forFeature([Team]), PlayerModule],
  controllers: [TeamController],
  providers: [TeamService, TeamCreatorService, TeamPlayerService],
})
export class TeamModule {}
