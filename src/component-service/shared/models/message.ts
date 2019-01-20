import { Guid } from './guid';
import { Constants } from './constants';

export class Message {

    time: number = 0;
    messageID = Guid.getGuid();
    source: string;
    correlationId: string;
    topicName: string;
    payload: any;

    constructor(sourceID: string) {
        this.time = Date.now();
        this.source = `${Constants.cCS}/`  + sourceID;
    }
}
