import { Inject, Injectable } from '@nestjs/common'
import { Client4 } from '@mattermost/client'
import mattermostConfig from './mattermost.config'
import { ConfigType } from '@nestjs/config'

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
