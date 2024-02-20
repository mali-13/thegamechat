import { Module } from '@nestjs/common'
import { PlayerCreatorService } from './player-creator.service'
import { PlayerCreatorController } from './player-creator.controller'
import { PlayerModule } from '../player.module'

@Module({
  imports: [PlayerModule],
  providers: [PlayerCreatorService],
  exports: [PlayerCreatorService],
  controllers: [PlayerCreatorController],
})
export class PlayerCreatorModule {}
