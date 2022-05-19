import { createRequire } from "module";
const require = createRequire(import.meta.url);
import moment from "moment";
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");

const setReqParams4crawling = req => {
  console.log("reqqqq", req);

  const reqParams = {
    searchIndex: req.searchIndex || "", // 검색 8개 인덱스, all
    keyword: req.keyword || "", // keyword
    sort: req.sort || "",
    size: req.size || 10,
    from: req.from || 1
    // type: //req.type || '',
  };
  // console.log("reeeeqqq", reqParams);
  return reqParams;
};

//[query loooggg]
const setLog4OpenQueryLog = (indexNm, keyword, searchResult) => {
  const openqueryLog = {
    index: indexNm,
    query: keyword,
    total: searchResult.hits.total.value,
    took: searchResult.took
  };
  console.log(openqueryLog);
  return openqueryLog;
};

const setAutocomplete = req => {
  const openqueryLog = {
    keyword: req.keyword || "", // keyword
    label: req.label || "",
    size: req.size || 10,
    middle: req.middle || 1,
    sort: req.sort || ""
    // type: //req.type || '',
  };
  console.log(openqueryLog);
  return openqueryLog;
};

//[gateway]
const setReqParams4Gateway = req => {
  let result = {};
  let gatewayService = req.gatewayService;
  result.sort = req.sort;
  switch (gatewayService) {
    case "autocomplete":
    case "related":
    case "speller":
    case "recommend":
      // 자동완성, 연관검색어
      result["gatewayService"] = gatewayService;
      result["keyword"] = req.keyword;
      result["label"] = req.label;
      result["size"] = req.size;
      break;
    case "popquery":
      result["gatewayService"] = gatewayService;
      result["label"] = req.label;
      result["size"] = req.size;
      break;
  }
  return result;
};

export {
  setReqParams4Gateway,
  setLog4OpenQueryLog,
  setReqParams4crawling,
  setAutocomplete
};
