import { Test, TestingModule } from '@nestjs/testing'
import { TeamInviteCodeService } from './team-invite-code.service'

describe('TeamPlayerService', () => {
  let service: TeamInviteCodeService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamInviteCodeService],
    }).compile()

    service = module.get<TeamInviteCodeService>(TeamInviteCodeService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
