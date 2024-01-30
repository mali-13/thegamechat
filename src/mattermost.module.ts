import { Client4 } from '@mattermost/client'
import { Global, Module } from '@nestjs/common'

export class Mattermost extends Client4 {}

@Global()
@Module({
  providers: [
    {
      provide: Mattermost,
      useFactory: async () => {
        const mattermost = new Mattermost()
        mattermost.setUrl('http://localhost:8065')
        mattermost.setToken('irdib7uhkjyjpkpcdz6ap54qny')
        return mattermost
      },
    },
  ],
  exports: [Mattermost],
})
export class MattermostModule {}
