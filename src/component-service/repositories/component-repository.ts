import { Result } from '../shared/models/enum';
import { Logger } from '../shared/services/logger.service';
import { DatabaseService } from '../shared/services/database.service';
import { DatabaseConfiguration, DBParameters } from '../shared/models/database-configuration';
import { Component } from '../shared/models/component';
import { KeyValue } from '../shared/models/key-value';
import { IRepository } from '../shared/models/irepository';
import * as mssql from 'mssql';
import { DatabaseHelper } from './database-helper';
import { Constants } from '../shared/models/constants';

export class ComponentRepository implements IRepository<Component> {
  constructor() { }

  /**
  * @summary inserts new Component
  * @param {Component} entity - the new component
  * @returns {Promise<Result>} - Result enum wrapped in a promise.
  */
  async create(entity: Component): Promise<Result> {
    try {
      let paramsArray = new Array<DBParameters>();
      paramsArray.push(new DBParameters(Constants.cOrg_ID, entity.orgID.toString(), mssql.BigInt));
      paramsArray.push(new DBParameters(Constants.cTYPE_NAME, entity.typeName, mssql.NVarChar));
      paramsArray.push(new DBParameters(Constants.cNAME_L1, entity.name_L1, mssql.NVarChar));
      paramsArray.push(new DBParameters(Constants.cNAME_L2, entity.name_L2, mssql.NVarChar));
      paramsArray.push(new DBParameters(Constants.cNAME_L3, entity.name_L3, mssql.NVarChar));
      paramsArray.push(new DBParameters(Constants.cNAME_L4, entity.name_L4, mssql.NVarChar));
      paramsArray.push(new DBParameters(Constants.cQUEUE_BRANCH_ID, entity.queueBranch_ID.toString(), mssql.BigInt));
      paramsArray.push(new DBParameters(Constants.cRELATED_CLASS_NAME, entity.relatedClassName, mssql.NVarChar));
      paramsArray.push(new DBParameters(Constants.cRELATED_OBJECT_ID, entity.relatedObject_ID.toString(), mssql.BigInt));
      paramsArray.push(new DBParameters(Constants.cIDENTITY, entity.identity, mssql.NVarChar));
      paramsArray.push(new DBParameters(Constants.cADDRESS, entity.address, mssql.NVarChar));
      paramsArray.push(new DBParameters(Constants.cDESCRIPTION, entity.description, mssql.NVarChar));

      let databaseService = new DatabaseService();
      let config = new DatabaseConfiguration();
      await databaseService.open(config);

      let result = await databaseService.executeProcedure(Constants.cCOMPONENT_INSERT, paramsArray);

      return result;
    } catch (error) {
      Logger.error(error);
    }
  }

  /**
  * @summary get a list of component
  * @param {Component} entity - entity
  * @returns {Promise<any>} - list of component as JSON string.
  */
  async getAll(entity: Component): Promise<any> {
    try {
      let tableName = await DatabaseHelper.getTableName(entity);
      let attributesStr = await DatabaseHelper.getEntityAttributes(entity);

      let sqlCommand = `${Constants.cSELECT} ${attributesStr} ${Constants.cFROM} ${tableName} ${Constants.cFOR_JSON_AUTO}`;

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
      return null;
    }
  }

  /**
  * @summary get an component
  * @param {Component} entity - entity
  * @param {Array<KeyValue>} params - the paramters for the sql query
  * @returns {Promise<any>} - component as JSON string.
  */
  async get(entity: Component, params: Array<KeyValue>): Promise<any> {
    try {
      let sqlCondition = await DatabaseHelper.prepareCondition(params);
      let paramsArray = await DatabaseHelper.getParameters(params);
      let tableName = await DatabaseHelper.getTableName(entity);
      let attributesStr = await DatabaseHelper.getEntityAttributes(entity);

      let sqlCommand = `${Constants.cSELECT} ${attributesStr} ${Constants.cFROM} ${tableName} ${sqlCondition.value} ${Constants.cFOR_JSON_AUTO}`;
      let databaseService = new DatabaseService();
      let config = new DatabaseConfiguration();

      await databaseService.open(config);

      let component = await databaseService.get(sqlCommand, paramsArray);

      if (component && component[0]) {
        return component[0][DatabaseHelper.jsonKey];
      } else {
        return null;
      }
    } catch (error) {
      Logger.error(error);
      return null;
    }
  }

  /**
  * @summary get an component Configuration
  * @param {Component} entity - entity
  * @param {Array<KeyValue>} params - the paramters for the sql query
  * @param {string} columnName - the column Name you want select
  * @returns {Promise<any>} - component column configuration as JSON string.
  */
  async getColumn(entity: Component, params: Array<KeyValue>, columnName: string): Promise<any> {
    try {
      let paramsArray = await DatabaseHelper.getParameters(params);
      let sqlCondition = await DatabaseHelper.prepareCondition(params);
      let tableName = await DatabaseHelper.getTableName(entity);
      let sqlCommand = `${Constants.cSELECT} ${columnName} ${Constants.cFROM} ${tableName} ${sqlCondition.value} ${Constants.cFOR_JSON_AUTO}`;

      let databaseService = new DatabaseService();
      let config = new DatabaseConfiguration();

      await databaseService.open(config);
      let columnData = await databaseService.get(sqlCommand, paramsArray);

      if (columnData && columnData[0]) {
        return columnData[0][DatabaseHelper.jsonKey];
      } else {
        return null;
      }
    } catch (error) {
      Logger.error(error);
      return null;
    }
  }

  /**
  * @summary update a component name and description
  * @param {Array<KeyValue>} params - the paramters for the sql query
  * @returns {Promise<Result>} - Result enum wrapped in a promise.
  */
  async update(params: KeyValue[]): Promise<Result> {
    try {
      let paramsArray = await DatabaseHelper.getParameters(params);

      let databaseService = new DatabaseService();
      let config = new DatabaseConfiguration();

      await databaseService.open(config);
      let result = await databaseService.executeProcedure(Constants.cUPDATE_COMPONENT, paramsArray);
      if (result == Result.Success) {
        return Result.Success;
      } else {
        return Result.Failed;
      }
    } catch (error) {
      Logger.error(error);
      return Result.Failed;
    }
  }

  /**
  * @summary update an component Configuration
  * @param {Array<KeyValue>} params - the paramters for the sql query
  * @returns {Promise<Result>} - Result enum wrapped in a promise.
  */
  async updateConfig(params: Array<KeyValue>): Promise<Result> {
    try {
      let paramsArray = await DatabaseHelper.getParameters(params);

      let databaseService = new DatabaseService();
      let configDB = new DatabaseConfiguration();

      await databaseService.open(configDB);
      let result = await databaseService.executeProcedure(Constants.cUPDATE_COMPONENT__CONFIGURATION, paramsArray);
      if (result == Result.Success) {
        return Result.Success;
      } else {
        return Result.Failed;
      }
    } catch (error) {
      Logger.error(error);
      return Result.Failed;
    }
  }

  /**
  * @summary update an component Report
  * @param {Array<KeyValue>} params - the paramters for the sql query
  * @returns {Promise<Result>} - Result enum wrapped in a promise.
  */
  async updateReport(params: Array<KeyValue>): Promise<Result> {
    try {
      let paramsArray = await DatabaseHelper.getParameters(params);

      let databaseService = new DatabaseService();
      let config = new DatabaseConfiguration();

      await databaseService.open(config);
      let result = await databaseService.executeProcedure(Constants.cUPDATE_COMPONENT_REPORTED_DATA, paramsArray);
      if (result == Result.Success) {
        return Result.Success;
      } else {
        return Result.Failed;
      }
    } catch (error) {
      Logger.error(error);
      return Result.Failed;
    }
  }

  /**
  * @summary delete components
  * @param {Array<KeyValue>} params - the paramters for the sql query
  * @returns {Promise<Result>} - Result enum wrapped in a promise.
  */
  async delete(params: Array<KeyValue>): Promise<Result> {
    try {
      let paramsArray = new Array<DBParameters>();
      paramsArray.push(new DBParameters(Constants.cIDs, params.find(e => e.key === Constants.cIDs).value, mssql.NVarChar));

      let databaseService = new DatabaseService();
      let config = new DatabaseConfiguration();

      await databaseService.open(config);
      let result = await databaseService.executeProcedure(Constants.cDelete_COMPONENT, paramsArray);
      if (result == Result.Success) {
        return Result.Success;
      } else {
        return Result.Failed;
      }
    } catch (error) {
      Logger.error(error);
      return Result.Failed;
    }
  }
}
