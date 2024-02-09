import { Module } from '@nestjs/common'
import { TeamModule } from '../team.module'
import { TeamPlayerEditHandlerModule } from '../team-player/team-player-edit-handler/team-player-edit-handler.module'
import { TeamCreatorService } from './team-creator.service'
import { TeamCreatorController } from './team-creator.controller'
import { PlayerModule } from '../../player/player.module'

@Module({
  imports: [TeamModule, TeamPlayerEditHandlerModule, PlayerModule],
  providers: [TeamCreatorService],
  exports: [TeamCreatorService],
  controllers: [TeamCreatorController],
})
export class TeamCreatorModule {}
