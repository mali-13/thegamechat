import { Controller, Get, Param, Post } from '@nestjs/common'
import { TeamInviteCodeService } from './team-invite-code.service'

@Controller('teams/:teamId/invite-codes')
export class TeamInviteCodeController {
  constructor(readonly teamInviteCodeService: TeamInviteCodeService) {}

  @Get('')
  async findInviteCodes(@Param('teamId') teamId: number) {
    console.log('teamId', teamId)
    return this.teamInviteCodeService.findInviteCodes(teamId)
  }

  @Post('/')
  async addInviteCode(@Param('teamId') teamId: number) {
    return this.teamInviteCodeService.addInviteCode(teamId)
  }
}
