import { Client4 } from '@mattermost/client'
import { Global, Module } from '@nestjs/common'

@Global()
@Module({
  providers: [
    {
      provide: 'Mattermost',
      useFactory: async () => {
        const client4 = new Client4()
        client4.setUrl('http://localhost:8065')
        client4.setToken('irdib7uhkjyjpkpcdz6ap54qny')
        return client4
      },
    },
  ],
  exports: ['Mattermost'],
})
export class MattermostModule {}
