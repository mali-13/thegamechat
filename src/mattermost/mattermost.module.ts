import { Global, Module } from '@nestjs/common'
import { Mattermost } from './mattermost.service'

@Global()
@Module({
  providers: [Mattermost],
  exports: [Mattermost],
})
export class MattermostModule {}
