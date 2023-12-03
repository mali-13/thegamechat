import { Injectable } from '@nestjs/common';

@Injectable()
export class PlayerService {
  async addPlayer() {
    return 'Mali, Vetoni, Mentori';
  }
}
