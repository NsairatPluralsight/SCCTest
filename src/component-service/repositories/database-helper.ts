import { Logger } from "../shared/services/logger.service";
import { KeyValue } from "../shared/models/key-value";
import { DBParameters } from "../shared/models/database-configuration";
import * as mssql from 'mssql';
import { Constants } from "../shared/models/constants";

export class DatabaseHelper {
  static table_Prefex = "cst_";
  static jsonKey = "JSON_F52E2B61-18A1-11d1-B105-00805F49916B";

    /**
   * @summary extract the attribute names of an entity
   * @param {any} entity - entity
   * @returns {string} - attribute as CSV .
   */
  static async getEntityAttributes(entity: any): Promise<string> {
    try {
      let attributes = Object.getOwnPropertyNames(entity);
      attributes = attributes.filter((value) => { return !value.startsWith("_"); });
      attributes = attributes.map((value) => { return `[${value}]`; });
      let attributesStr = attributes.join(",");
      return attributesStr;
    } catch (error) {
      Logger.error(error);
    }
  }

      /**
   * @summary genreate the sql condition
   * @param {Array<KeyValue>} params - the conditionn parameters
   * @returns {Promise<KeyValue> } - return sql condition as key value .
   */
  static async prepareCondition(params: Array<KeyValue>): Promise<KeyValue> {
    try {
      let sqlCondition = new KeyValue(Constants.cSQL_CONDITION, Constants.cWHERE);

      params.forEach(element => {
        sqlCondition.value += `${element.key} = @${element.key} ${Constants.cAND} `;
      });
      sqlCondition.value = sqlCondition.value.substring(0, sqlCondition.value.lastIndexOf(Constants.cAND));

      return sqlCondition;
    } catch (error) {
      Logger.error(error);
      return null;
    }
  }

  static async getParameters(params: Array<KeyValue>) {
    try {
      let dbParams = params.map(element => { return new DBParameters(element.key, element.value, this.getDBType(element.key))});
      return dbParams;
    } catch (error) {
      Logger.error(error);
    }
  }

  static getDBType(key: string): mssql.ISqlTypeFactoryWithNoParams {
    try {
      switch (key) {
        case Constants.cID:
        case Constants.cQUEUE_BRANCH_ID:
        case Constants.cRELATED_OBJECT_ID:
        case Constants.cOrg_ID:
         return mssql.BigInt;
        case Constants.cTYPE_NAME:
        case Constants.cNAME_L1:
        case Constants.cNAME_L2:
        case Constants.cNAME_L3:
        case Constants.cNAME_L4:
        case Constants.cREPORTED_DATA:
        case Constants.cCONFIGURATION:
        case Constants.cRELATED_CLASS_NAME:
        case Constants.cIDENTITY:
        case Constants.cADDRESS:
        case Constants.cDESCRIPTION:
        case Constants.cCAPTION_KEY:
        case Constants.cCONFIGURATION_SCHEMA:
        case Constants.cREPORTED_DATA_SCHEMA:
         return mssql.NVarChar;
      }
    } catch (error) {
      Logger.error(error);
    }
  }

  static async getTableName(entity: any) {
    try {
      let tableName = DatabaseHelper.table_Prefex + entity.constructor.name;
      return tableName
    } catch (error) {
      Logger.error(error);
    }
  }
}
