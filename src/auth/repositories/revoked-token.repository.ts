import { revokedTokenCollection } from '../../db/collections';

export const revokedTokenRepository = {
  async revoke(token: string): Promise<void> {
    await revokedTokenCollection.insertOne({ token, revokedAt: new Date() });
  },

  async isRevoked(token: string): Promise<boolean> {
    const found = await revokedTokenCollection.findOne({ token });
    return found !== null;
  },
};