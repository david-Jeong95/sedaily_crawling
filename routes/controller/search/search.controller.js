import { sendResStatusByOk, sendSedailyResult } from "../../../util/util.js";
import { errHandler } from "../../../util/util.js";
import { getMainData } from "../../../routes/service/search.service.js";
import Hooks from "../../../util/logger.js";
const logger = Hooks("moment");

const main = async (req, res) => {
  try {
    if (req.method === "POST") req.query = req.body;
    console.log("rqrqrq", req.body);
    const searchResult = await getMainData(req.query);
    const searchIndex = req.query.searchIndex;

    if (searchIndex === "all") {
    }
    res.send(sendSedailyResult(req.query, searchResult, null));
  } catch (err) {
    console.log(err);
    logger.error("----" + err);
    res.send(errHandler(req, res, err));
  }
};

export { main };
