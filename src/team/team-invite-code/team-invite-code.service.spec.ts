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

  it('should be defined', async () => {
    await service.addInviteCode(1)
    expect(service).toBeDefined()
  })
})
