import { Module } from '@nestjs/common'
import { TeamPlayerController } from './team-player.controller'
import { TeamPlayerService } from './team-player.service'
import { TeamModule } from '../team.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Team } from '../team.entity'
import { PlayerModule } from '../../player/player.module'

@Module({
  imports: [TypeOrmModule.forFeature([Team]), TeamModule, PlayerModule],
  controllers: [TeamPlayerController],
  providers: [TeamPlayerService],
})
export class TeamPlayerModule {}
