import { Module } from '@nestjs/common'
import { TeamInviteCodeController } from './team-invite-code.controller'
import { TeamInviteCodeService } from './team-invite-code.service'
import { TeamModule } from '../team.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Team } from '../team.entity'
import { PlayerModule } from '../../player/player.module'
import { InviteCode } from './invite-code.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Team, InviteCode]),
    TeamModule,
    PlayerModule,
  ],
  controllers: [TeamInviteCodeController],
  providers: [TeamInviteCodeService],
})
export class TeamInviteCodeModule {}
