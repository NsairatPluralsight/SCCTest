import { EventEmitter } from 'events';

export class EventsService {
  static broadcastMessage = new EventEmitter();
}
