import { registerAs } from '@nestjs/config'

export default registerAs('mattermost', () => ({
  personalAccessToken: process.env.MATTERMOST_PERSONAL_ACCESS_TOKEN,
  teamId: process.env.MATTERMOST_TEAM_ID,
  url: process.env.MATTERMOST_URL,
}))
