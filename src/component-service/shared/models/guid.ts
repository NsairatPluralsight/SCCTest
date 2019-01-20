import { v4 as uuid } from 'uuid';
import { Logger } from '../services/logger.service';

export class Guid {

  static getGuid(): string {
    try {
      return uuid();
    } catch (error) {
      Logger.error(error);
      throw(error);
    }
  }
}
