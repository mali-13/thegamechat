import { ChallengeService } from './challenge.service'
import { ChallengeDto } from './challenge.dto'
import { Body, Controller, Post } from '@nestjs/common'

@Controller('challenges')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Post('/')
  create(@Body() createChallengeDto: ChallengeDto) {
    return this.challengeService.create(createChallengeDto)
  }
}
