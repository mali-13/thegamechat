import { Controller, Get, Post } from '@nestjs/common'
import { TeamInviteCodeService } from './team-invite-code.service'

@Controller('teams/:teamId/invite-codes')
export class TeamInviteCodeController {
  constructor(readonly teamInviteCodeService: TeamInviteCodeService) {}

  @Get('')
  async findInviteCodes() {
    return []
  }

  @Post('/')
  async addInviteCode(teamId: number) {
    return this.teamInviteCodeService.addInviteCode(teamId)
  }
}
