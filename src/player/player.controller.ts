import { Controller, Post } from '@nestjs/common';
import { PlayerService } from './player.service';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post('/')
  addPlayer() {
    return this.playerService.addPlayer();
  }
}
