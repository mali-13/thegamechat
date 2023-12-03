import { Module } from '@nestjs/common'
import { TeamController } from './team.controller'
import { TeamService } from './team.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Team } from './team.entity'
import { PlayerModule } from '../player/player.module'

@Module({
  imports: [TypeOrmModule.forFeature([Team]), PlayerModule],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
