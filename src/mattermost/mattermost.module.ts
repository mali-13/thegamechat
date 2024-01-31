import { Client4 } from '@mattermost/client'
import { Global, Inject, Injectable, Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import mattermostConfig from './mattermost.config'

@Injectable()
export class Mattermost extends Client4 {
  constructor(
    @Inject(mattermostConfig.KEY)
    readonly config: ConfigType<typeof mattermostConfig>,
  ) {
    super()
    this.setUrl(config.url)
    this.setToken(config.personalAccessToken)
  }
}

@Global()
@Module({
  providers: [Mattermost],
  exports: [Mattermost],
})
export class MattermostModule {}
