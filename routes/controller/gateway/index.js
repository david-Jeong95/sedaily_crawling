import express from "express";
const router = express.Router();
import { autocomplete } from "./gateway.controller.js";
import { related } from "./gateway.controller.js";
import { recommend } from "./gateway.controller.js";
import { popquery } from "./gateway.controller.js";

//[통합검색]
// router.get('/ts', main);
// router.post('/ts', main);
router.all("/autocomplete", autocomplete);
router.all("/related", related);
router.all("/recommend", recommend);
router.all("/popquery", popquery);

export default router;
