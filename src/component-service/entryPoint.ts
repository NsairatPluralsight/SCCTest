
import { Result } from './shared/models/enum';
import { Logger } from './shared/services/logger.service';
import { ReportsService } from './actions/reports.service';
import { ConfigurationService } from './actions/configuration.service';
import { RegistrationService } from './actions/registration.service';
import { EventsService } from './shared/models/event';
import { Message } from './shared/models/message';
import { Guid } from './shared/models/guid';
import { ComponentManager } from './actions/component-manager.service';
import { Constants } from './shared/models/constants';
var rabbitMQClient = require("../rabbitMQClient");

export class EntryPoint {
  keys = ["ComponentService.*"];
  queueName = "ComponentService";
  topicPrefix = "CVMServer/";
  sourceID = '';
  rabbitMQClient: any;

  constructor() {
    this.rabbitMQClient = new rabbitMQClient(this.queueName, this.keys);
  }

  /**
  * @async
  * @summary intialaize rabbit MQ client start listining to the ComponentService queue
  */
  async start() {
    this.rabbitMQClient.receive(async (request, replay) => { await this.processRequest(request, replay) });

    EventsService.broadcastMessage.on(Constants.cEVENT, this.broadcastMessage);
  }

  /**
  * @async
  * @summary call back method to handle the resieved messages
  * @param request
  * @param reply
  * @returns {Promise<Result>} Result enum wrapped in a promise.
  */
  async processRequest(request: Message, reply: Message): Promise<Result> {
    try {
      let result = Result.Failed;
      let topic = request.topicName.split("/")[1];

      switch (topic) {
        case Constants.cREGISTRATION:
          let registration = new RegistrationService();
          result = await registration.registerComponent(request);
          reply = request;
          break;
        case Constants.cMANAGER:
          let componentManager = new ComponentManager();
          result = await componentManager.processMessageRequest(request);
          reply = request;
          break;
        case Constants.cCONFIGURATION:
          let configuration = new ConfigurationService();
          result = await configuration.processMessageRequest(request);
          reply = request;
          break;
        case Constants.cREPORT:
          let reports = new ReportsService();
          result = await reports.processMessageRequest(request);
          reply = request;
          break;
        case Constants.cDATA:
          result = await this.loadEntities(request);
          reply = request;
          break;
      }
      return result;
    } catch (error) {
      Logger.error(error);
      return Result.Failed;
    }
  }

  /**
  * @async
  * @summary call back method to handle the broadcasts messages
  * @param broadcastTopic - the topic you want to broadcast on
  * @param message - the message you want broadcast
  * @returns {Promise<Result>} Result enum wrapped in a promise.
  */
  async broadcastMessage(broadcastTopic: string, message: Message): Promise<Result> {
    try {
      let result = await this.rabbitMQClient.sendBroadcast(broadcastTopic, JSON.stringify(message));
      return result;
    }
    catch (error) {
      Logger.error(error);
      return Result.Failed;
    }
  };

  /**
  * @async
  * @summary sends a message to module using rabbit MQ Client
  * @param {any} payload - the data you want to send with the message
  * @param {string} topic - the message topic
  * @param {string} moduleName - the name of the module you want communicate with
  * @param {Array<any>} reply - the result from the target module
  * @returns {Promise<Result>} Result enum wrapped in a promise.
  */
  async sendToModule(payload: any, topic: string, moduleName: string, reply: Array<any>): Promise<Result> {
    try {
      let message = new Message(this.getSourceID());
      message.topicName = topic;
      message.payload = payload;

      let reqMessage = JSON.stringify(message);
      let result = await this.rabbitMQClient.send(moduleName, reqMessage, reply);
      return result;
    } catch (error) {
      Logger.error(error);
      return Result.Failed;
    }
  }

  /**
  * @async
  * @summary return a list of objects of a specific entitiy , full object or object only contains {ID , Name}
  * @param {Message} message - the message that resieved from MQ with sub topic name 'Configuration'
  * @return {Promise<number>} Result enum wrapped in a promise.
  */
  async loadEntities(message: Message): Promise<Result> {
    try {
      let topicName = this.getModuleName(message.payload.target);
      let data = new Array<any>();
      let result = await this.sendToModule(message.payload, topicName, Constants.cCVM_SERVER, data);

      if (result == Result.Success) {

        let response = JSON.parse(data[0]);

        if (response && response.payload) {
          message.payload = response.payload;
          result = Result.Success;
        } else {
          result = Result.Failed;
        }
      } else {
        result = Result.Failed;
      }
      return result;
    } catch (error) {
      Logger.error(error);
      return Result.Failed;
    }
  }

  /**
  * @summary return the module name as string
  * @param {string} target - the target name that contains module name
  * @return {Promise<string>} module name.
  */
  getModuleName(target: string): string {
    try {
      var targetArr = target.split('.');
      var moduleName = this.topicPrefix + targetArr[0];
      return moduleName;
    } catch (error) {
      Logger.error(error);
      return undefined;
    }
  }

  /**
  * @summary return a new guid if sourse is not defined
  * @return {string} guid.
  */
  getSourceID(): string {
    if (this.sourceID == undefined) {
      this.sourceID = Guid.getGuid();
    }
    return this.sourceID;
  }
}
