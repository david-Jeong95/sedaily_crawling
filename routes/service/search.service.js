import deepcopy from "deepcopy";
import { setReqParams4crawling } from "../../routes/models/payload/payload.js";
import { getMainQuery } from "../../routes/models/payload/payload.model.js";
import searchEngine from "../../middleware/elasticsearch.js";
const elasticsearch = new searchEngine("SE");
// import Gateway from '../../routes/service/gateway.service.js';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const index_config = require("../../config/es_index_conf.json");

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

export { getMainData };
