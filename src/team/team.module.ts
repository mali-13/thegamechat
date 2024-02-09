import { forwardRef, Module } from '@nestjs/common'
import { TeamController } from './team.controller'
import { TeamService } from './team.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Team } from './team.entity'
import { PlayerModule } from '../player/player.module'
import { TeamCreatorService } from './team-creator/team-creator.service'
import { TeamPlayerService } from './team-player/team-player.service'
import { TeamPlayerController } from './team-player/team-player.controller'
import { TeamCreatorController } from './team-creator/team-creator.controller'
import { TeamChannelSyncModule } from '../team-channel-sync/team-channel-sync.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Team]),
    PlayerModule,
    forwardRef(() => TeamChannelSyncModule),
  ],
  controllers: [TeamController, TeamPlayerController, TeamCreatorController],
  providers: [TeamService, TeamCreatorService, TeamPlayerService],
  exports: [TeamService, TeamCreatorService, TeamPlayerService],
})
export class TeamModule {}
