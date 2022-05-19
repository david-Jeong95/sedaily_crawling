import deepcopy from "deepcopy";
import {
  setReqParams4crawling,
  setReqParams4Gateway,
  setLog4OpenQueryLog
} from "../models/payload/payload.js";
import {
  getMainQuery,
  autocomplete,
  related,
  popquery,
  recommend
} from "../models/payload/payload.model.js";
import { makeURL4QueryLog } from "../../util/util.js";
import searchEngine from "../../middleware/elasticsearch.js";
const elasticsearch = new searchEngine("SE");
// import Gateway from '../../routes/service/gateway.service.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const index_config = require("../../config/es_index_conf.json");
const ser_index_config = require("../../config/service_index_config.json");

// Process Execute Query

const getMainData = async req => {
  try {
    let reqParams = deepcopy(req);
    // let index = index_config[reqParams.searchIndex].index;
    let querystring = "";
    let searchData = {};
    console.log("reqParams", reqParams);
    let setParams = setReqParams4crawling(reqParams);
    querystring = await getMainQuery(setParams);

    searchData = await elasticsearch.singleSearch(
      querystring.index,
      querystring.body
    );

    return searchData;
  } catch (err) {
    throw err;
  }
};
const makeQuerylog = async (indexNm, keyword, searchResult) => {
  try {
    const logSet = setLog4OpenQueryLog(indexNm, keyword, searchResult);
    const logOption = makeURL4QueryLog(logSet);
    return request(logOption);
  } catch (err) {
    throw err;
  }
};

const getGatewayServiceResult = async req => {
  try {
    const reqParams = deepcopy(req);
    let gatewayService = req.gatewayService;
    let queryArr = [];
    const setParams = setReqParams4Gateway(reqParams);

    // [ 연관검색어 + 추천검색어 ]
    if (gatewayService === "related") {
      //연관검색일때 먼저 recommend
      let indexName = ser_index_config[gatewayService].index;
      let indexNameRec = ".openquery-related";
      let indexList = [indexNameRec, indexName];

      // for (let i = 0; i < indexList.length; i++) {
      //   let queryObj = {};
      //   if (i === 0) {
      //     // Recommend
      //     //   const recQuery = await related(setParams, i);
      //     //   queryObj[indexNameRec] = recQuery;
      //     //            console.log(`Recommend : IndexName [${indexNameRec}] --- Query ::: %j`, recQuery);
      //   } else if (i === 1) {
      //     const relQuery = await related(setParams, i);
      //     //          console.log(`Related : IndexName [${indexName}] --- Query ::: %j`, relQuery);
      //     queryObj[indexName] = relQuery;
      //   }
      //   queryArr.push(queryObj);
      // }
      const msearchResult = await elasticsearch.multiSearch(queryArr, "");
      return msearchResult;
    } else if (gatewayService === "autocomplete") {
      console.log(ser_index_config[gatewayService].index);
      let indexName = ser_index_config[gatewayService].index;
      console.log(indexName);
      //   const searchQuery = await elasticQuery.getGatewayServiceQuery(setParams);
      const searchQuery = await autocomplete(setParams);
      //        console.log(`Autocomplete : IndexName [${indexName}] --- Query ::: %j`, searchQuery);
      const result = await elasticsearch.singleSearch(indexName, searchQuery);

      return result;
    } else if (gatewayService === "popquery") {
      let indexName = ".openquery-popquery";
      const searchQuery = await popquery(setParams);
      // console.log(`popquery : IndexName [${indexName}] --- Query ::: %j`, searchQuery);
      const result = await elasticsearch.singleSearch(indexName, searchQuery);
      return result;
    } else if (gatewayService === "recommend") {
      let indexName = ".openquery-recommend";
      const searchQuery = await recommend(setParams);
      // console.log(`popquery : IndexName [${indexName}] --- Query ::: %j`, searchQuery);
      const result = await elasticsearch.singleSearch(indexName, searchQuery);
      return result;
    }
  } catch (err) {
    throw err;
  }
};

export { getMainData, getGatewayServiceResult, makeQuerylog };
