import express from "express";
const router = express.Router();
import { main } from "./search.controller.js";

//[통합검색]
// router.get('/ts', main);
// router.post('/ts', main);
router.post("/ts", main);

export default router;
