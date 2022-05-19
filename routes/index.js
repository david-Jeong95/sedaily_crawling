// import express from 'express';
// const router = express.Router();

// /* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// export default router;
import search from "./controller/search/index.js";
import gateway from "./controller/gateway/index.js";
// import connect from 'connect';

const index = app => {
  // app = connect();
  app.use("/search", search);
  app.use("/gateway", gateway);
};

export default index;
