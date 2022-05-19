import {
  sendResStatusByOk,
  sendResPop,
  sendRecommend
} from "../../../util/util.js";
import { errHandler } from "../../../util/util.js";
import { getGatewayServiceResult } from "../../service/gateway.service.js";
import {
  autoData,
  relatedData,
  popData,
  recommendData
} from "../../models/response/serviceDataInfo.js";
import Hooks from "../../../util/logger.js";
const logger = Hooks("moment");

const autocomplete = async (req, res) => {
  try {
    if (req.method === "POST") req.query = req.body;
    req.query.gatewayService = "autocomplete";
    req.query.sort = "weight,_score,keyword.keyword";
    const searchResult = await getGatewayServiceResult(req.query, res);
    const modelResult = await autoData(req.query, searchResult);

    res.send(sendResStatusByOk(req.query, modelResult, null));
  } catch (err) {
    console.log(err);
    logger.error("----" + err);
    res.send(errHandler(req, res, err));
  }
};

const related = async (req, res) => {
  try {
    if (req.method === "POST") req.query = req.body;
    req.query.gatewayService = "related";
    // req.query.sort = 'timestamp';

    const searchResult = await getGatewayServiceResult(req.query, res);
    const modelResult = await relatedData(req.query, searchResult.responses); // 연관 + 추천일때
    // const modelResult = await ResponseModel.getRelatedData(req.query, searchResult);

    res.send(sendResStatusByOk(req.query, modelResult, null));
  } catch (err) {
    console.log(err);
    logger.error("----" + err);
    res.send(errHandler(req, res, err));
  }
};

const recommend = async (req, res) => {
  try {
    if (req.method === "POST") req.query = req.body;
    req.query.gatewayService = "recommend";
    req.query.sort = "timestamp";
    console.log("reqqueryy", req.query);
    const searchResult = await getGatewayServiceResult(req.query, res);
    console.log("searchResult", searchResult);
    const modelResult = await recommendData(req.query, searchResult);

    res.send(sendRecommend(req.query, modelResult, null));
  } catch (err) {
    console.log(err);
    logger.error("----" + err);
    res.send(errHandler(req, res, err));
  }
};

const popquery = async (req, res) => {
  try {
    if (req.method === "POST") req.query = req.body;
    req.query.gatewayService = "popquery";
    req.query.sort = "timestamp";
    req.query.size = 1;
    // console.log("reqqqq", req.query);
    const searchResult = await getGatewayServiceResult(req.query, res);
    // console.log("searchResult", searchResult);
    const modelResult = await popData(req.query, searchResult);

    res.send(sendResPop(req.query, modelResult, null));
  } catch (err) {
    console.log(err);
    logger.error("----" + err);
    res.send(errHandler(req, res, err));
  }
};

export { autocomplete, related, recommend, popquery };
