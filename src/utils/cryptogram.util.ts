import * as crypto from 'crypto';
import { isNotEmptyString } from './string.util';

export function generateUid(content: string): string {
  if (isNotEmptyString(content)) {
    return crypto.pbkdf2Sync(content, 'uid', 10000, 8, 'sha1').toString('hex')
  } else {
    return ''
  }
}

export function generateInvitationCode(content: string): string {
  if (isNotEmptyString(content)) {
    return crypto.pbkdf2Sync(content, 'InvitationCode', 10000, 4, 'sha1').toString('hex')
  } else {
    return ''
  }
}