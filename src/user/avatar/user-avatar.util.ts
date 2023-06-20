import { createHash } from 'crypto';
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { UserAvatar } from './user-avatar.schema';

export class UserAvatarUtil {
  static avatarPath(reqResId: number): string {
    return `avatars/${reqResId}.jpg`;
  }

  static parseAvatarToBase64(buffer: Buffer) {
    const base64Image = buffer.toString('base64');
    const dataURIScheme = 'data:image/jpg;base64,';

    return dataURIScheme + base64Image;
  }

  static avatarExistsLocally(reqResId: number): boolean {
    return existsSync(this.avatarPath(reqResId));
  }

  static readAvatarLocally(reqResId: number): string {
    const avatar = readFileSync(this.avatarPath(reqResId));
    const base64Avatar = this.parseAvatarToBase64(avatar);

    return base64Avatar;
  }

  static writeAvatar(reqResId: number, buffer: Buffer): void {
    writeFileSync(this.avatarPath(reqResId), buffer);
  }

  static deleteAvatarLocally(reqResId: number): void {
    unlinkSync(this.avatarPath(reqResId));
  }

  static createHash(avatarHex: Buffer): string {
    const hash = createHash('sha256');
    hash.update(avatarHex);
    return hash.digest('hex');
  }

  static mapUserAvatarfromProperties(userId: number, hash: string): UserAvatar {
    return {
      userId: userId,
      hash: hash,
    } as UserAvatar;
  }
}
