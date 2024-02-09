import { Module } from '@nestjs/common'
import { TeamModule } from '../../team.module'
import { TeamChannelSyncModule } from '../../../team-channel-sync/team-channel-sync.module'
import { TeamPlayerEditHandler } from './team-player-edit-handler'
import { TeamPlayerEditHandlerController } from './team-player-edit-handler.controller'

@Module({
  providers: [TeamPlayerEditHandler],
  imports: [TeamModule, TeamChannelSyncModule],
  controllers: [TeamPlayerEditHandlerController],
})
export class TeamPlayerEditHandlerModule {}
