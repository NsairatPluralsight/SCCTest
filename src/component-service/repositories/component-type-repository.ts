import { ComponentType } from "../shared/models/component-type";
import { IRepository } from "../shared/models/irepository";
import { Result } from "../shared/models/enum";
import { Logger } from "../shared/services/logger.service";
import { DatabaseConfiguration } from "../shared/models/database-configuration";
import { DatabaseService } from "../shared/services/database.service";
import { KeyValue } from "../shared/models/key-value";
import { DatabaseHelper } from "./database-helper";
import { Constants } from "../shared/models/constants";

export class ComponentTypeRepository implements IRepository<ComponentType> {

  create(entity: ComponentType, params: KeyValue[]): Promise<Result> {
    throw new Error("Method not implemented.");
  }

  update(params: KeyValue[]): Promise<Result> {
    throw new Error("Method not implemented.");
  }

  delete(params: KeyValue[]): Promise<Result> {
    throw new Error("Method not implemented.");
  }

 async getAll(entity: ComponentType): Promise<any> {
    try {
      let tableName = await DatabaseHelper.getTableName(entity);
      let attributesStr = await DatabaseHelper.getEntityAttributes(entity);

      let sqlCommand = `${Constants.cSELECT} ${attributesStr} ${Constants.cFROM} ${tableName}`;

      let databaseService = new DatabaseService();
      let config = new DatabaseConfiguration();

      await databaseService.open(config);

      let components = await databaseService.get(sqlCommand);

      if (components && components[0]) {
        return components[0][DatabaseHelper.jsonKey];
      } else {
        return null;
      }
    } catch (error) {
      Logger.error(error);
    }
  }

  async get(entity: ComponentType, params: KeyValue[]): Promise<ComponentType> {
    try {
      let paramsArray = await DatabaseHelper.getParameters(params);
      let sqlCondition = await DatabaseHelper.prepareCondition(params);
      let tableName = await DatabaseHelper.getTableName(entity);
      let attributesStr = await DatabaseHelper.getEntityAttributes(entity);

      let sqlCommand = `${Constants.cSELECT} ${attributesStr} ${Constants.cFROM} ${tableName} ${sqlCondition.value}`;
      let databaseService = new DatabaseService();
      let config = new DatabaseConfiguration();

      await databaseService.open(config);

      let component = await databaseService.get(sqlCommand, paramsArray);

      if (component && component[0]) {
        return component[0];
      } else {
        return null;
      }
    } catch (error) {
      Logger.error(error);
    }
  }
}
