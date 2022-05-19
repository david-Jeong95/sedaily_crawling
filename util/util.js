// util.js
import fs from "fs";
import config from "../config/config.js";
import logger from "./logger.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const index_config = require("../config/es_index_conf.json");

const getEmpty = value => {
  var rtn = true;
  if (
    !(
      typeof value === "undefined" ||
      value === "" ||
      value === undefined ||
      value === " "
    ) &&
    value
  ) {
    rtn = false;
  }
  return rtn;
};
/* [SET] response sned OK */
const sendResStatusByOk = (req, body, aggs, elaspsed) => {
  if (req === undefined) {
  } else {
    // Control
    let obj = {};
    const ret = {
      status: 200,
      reason: "OK"
    };
    let result = [];
    let hits = body;

    //ndsl autocomplete
    for (let cnt of hits) {
      let dataList = {};
      dataList.keyword = cnt.keyword;
      dataList.highlight = cnt.highlight;
      dataList.weight = cnt.weight;

      result.push(dataList);
    }

    obj.status = ret;
    obj.index = index_config.all.index;
    // obj.total = body.hits.total.value;
    obj.data = result;
    return obj;
  }
};

const sendSedailyResult = (req, body, aggs, elaspsed) => {
  if (req === undefined) {
  } else {
    // Control
    let obj = {};
    const ret = {
      status: 200,
      reason: "OK"
    };
    let result = [];
    let hits = body.hits.hits;
    console.log("hitttts", hits);
    //sedaily
    for (let cnt of hits) {
      let dataList = {};
      dataList.id = cnt._source.id;
      dataList.nid = cnt._source.nid;
      dataList.category = cnt._source.category;
      dataList.title = cnt._source.title;
      dataList.start_dttm = cnt._source.start_dttm;
      dataList.update_dttm = cnt._source.update_dttm;
      dataList.reporter = cnt._source.reporter;
      dataList.content = cnt._source.content;
      result.push(dataList);
    }

    obj.status = ret;
    obj.index = index_config.all.index;
    // obj.total = body.hits.total.value;
    obj.data = result;
    return obj;
  }
};

const sendResPop = function (req, body, aggs, elaspsed) {
  elaspsed = elaspsed != undefined ? elaspsed : {};
  if (req === undefined);
  else {
    // Control
    let obj = {};
    const ret = {
      code: 200,
      message: "OK"
    };
    obj.status = ret;

    obj.data = body;
    return obj;
  }
};

const sendRecommend = function (req, body, aggs, elaspsed) {
  elaspsed = elaspsed != undefined ? elaspsed : {};
  if (req === undefined);
  else {
    // Control
    let obj = {};
    const ret = {
      code: 200,
      message: "OK"
    };
    obj.status = ret;

    obj.data = body;
    return obj;
  }
};

/**
 *
 * @param req
 * @param err
 * @param msg
 * @returns {{reason: *, status: *}}
 */
const setErrResMsg = (req, err, msg) => {
  if (req === undefined) {
  } else {
    // Control
  }
  return {
    status: err,
    reason: msg
  };
};

const errHandler = (req, res, err) => {
  res.status(500).send(setErrResMsg(req, 500, err.message));
};

/** [SET] param send ERROR */
const makeResParamByStatErr = (req, statusCode, err) => {
  const messageObj = [];
  if (err === undefined) {
  } else {
    err.forEach(item => {
      messageObj.push(item.msg);
    });
  }
  return {
    status: statusCode,
    message: messageObj
  };
};

/**
 * [Request Parameter] Check Validation
 *
 * @param req : Request Object
 * @param res : Response Object
 * @param fileName : Source File Name
 * @param param : Required Request Paramter Array
 * @returns {{errMsg: string, status: boolean}}
 */
const validateReqParams = async (req, res, fileName, param) => {
  reqParam(`[${req.paramStatus}]Info`, req, fileName);
  if (req.method === "POST") req.query = req.body;

  const errStatus = {
    status: false,
    errMsg: ""
  };
  param.forEach(item => {
    // CheckQuery() 결과를 req.getValidationResult()를 통해서 가져 올 수 있다.
    req.checkQuery(item, `${item} required`).notEmpty();
  });

  // const err = req.validationErrors();
  const result = await req.getValidationResult();
  if (!result.isEmpty()) {
    const erros = result.array().map(element => {
      return element.msg;
    });
    logger.error(`validationErrors : ${erros}`, fileName);
    errStatus.status = true;
    errStatus.errStatus = 500;
    errStatus.errMsg = erros;
  }

  return errStatus;
};

/** [LOG] Request Parameter */
const reqParam = function (urlname, req, fileName) {
  logger.info("---------------------------------------", fileName);
  logger.info(`${urlname} / (method:${req.method})`, fileName);
  logger.info("---------------------------------------", fileName);
};

/**
 * gateway의 제공하는 Service['autocomplete','recommend','popuqery']별 필수 파라미터 체크.
 *
 * @param req
 * @param res
 * @returns {null}
 */
const validReq4Service = function (req, res) {
  let isChkSum = null;
  const autoParam = ["keyword", "label"];
  const popParam = ["label"];
  const recomParam = ["keyword", "label"];

  switch (req.query.serviceName) {
    case "autocomplete":
      // 자동완성
      isChkSum = this.validateReqParams(req, res, req.paramStatus, autoParam);
      break;
    case "popquery":
      // 인기 검색어
      isChkSum = this.validateReqParams(req, res, req.paramStatus, popParam);
      break;
    case "recommend":
      // 추천 검색어
      isChkSum = this.validateReqParams(req, res, req.paramStatus, recomParam);
      break;
    default:
      break;
  }
  return isChkSum;
};

/**
 * gateway의 Service별 URL 생성
 *
 * @param reqParams
 * @returns {string}
 */
const makeURL4Service = function (reqParams) {
  let resultURL = `http://${config.OPENQUERY_GATEWAY}/service/${reqParams.serviceName}`;

  switch (reqParams.serviceName) {
    case "autocomplete":
      // 자동완성
      resultURL += `?keyword=${reqParams.keyword}&label=${reqParams.label}`;
      break;
    case "popquery":
      // 인기 검색어
      resultURL += `?label=${reqParams.label}`;
      break;
    case "recommend":
      // 추천 검색어
      resultURL += `?keyword=${reqParams.keyword}&label=${reqParams.label}`;
      break;
    default:
  }
  return resultURL;
};

/**
 * gateway 검색어 로깅
 * @param {*} req
 * @param {*} res
 */
const makeURL4QueryLog = openqueryLog => {
  try {
    let paramList = openqueryLog;
    const url = `http://${config.OPENQUERY_GATEWAY}/gateway/_querylog`;
    const options = {
      method: "POST",
      uri: url,
      body: paramList,
      json: true
    };
    return options;
  } catch (err) {
    throw err;
  }
};

/**
 * PM2가 저장하는 Log Directory 존재 여부 확인 및 생성
 *
 * @param path {String} PM2 설정에서 로그파일 위치
 */
const checkFolderExist = function (path) {
  fs.readdir(path, error => {
    if (error) {
      logger.info("##### Logging Directory not existed!!! ####");
      logger.info("##### Start Make directory /log/solution/... ####");
      fs.mkdirSync(path);
    }
  });
};

export {
  getEmpty,
  sendResStatusByOk,
  setErrResMsg,
  errHandler,
  makeResParamByStatErr,
  validateReqParams,
  reqParam,
  validReq4Service,
  makeURL4Service,
  makeURL4QueryLog,
  checkFolderExist,
  sendResPop,
  sendRecommend,
  sendSedailyResult
};
