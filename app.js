import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import http from "http";

const __dirname = path.resolve();

import indexRouter from "./routes/index.js";
// import usersRouter from './routes/users.js';
import { createRequire } from "module";

// import swaggerJSDoc from 'swagger-jsdoc';
// import { swaggerOption } from './util/swagger.js'
// import swaggerSpec from swaggerJSDoc(swaggerOption);
// import swaggerUi from 'swagger-ui-express';
import { swaggerUi, specs } from "./util/swagger.js";

// const swaggerStyle = {
//   customCss: ".swagger-ui ", //Css header 삭제
//   customSiteTitle: "sedaily"
// };

const require = createRequire(import.meta.url);
const configFile = require("./config/config.json");
const configMode = configFile.run_mode;
const config = configFile[configMode];
const app = express();

// // view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/search", (req, res) => {
  let keyword = req.query.keyword || "";
  res.render("crawling", { keyword: keyword });
});
// app.engine('html', require('ejs').renderFile);

//server port
const port = `${config.API_SERVICE_PORT}`;
app.set("port", port);

app.use(logger("dev"));
app.use(express.json()); //json으로 이루어진 request body를 받았을 경우, 요청값을 제대로 받아오기 위해서
app.use(express.urlencoded({ extended: false })); //true면 qs모듈을 사용, false면 query-string모듈 사용
app.use(cookieParser()); //요청된 쿠키를 쉽게 추출할 수 있게 해주는 미들웨어
app.use(express.static(path.join(__dirname, "public"))); //이미지, css 파일 및 js파일과 같은 정적파일을 제공하기 위해 사용되는 미들웨어 함수

// app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerStyle));
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

https: indexRouter(app);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//create http server
const server = http.createServer(app);
server.listen(port);

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
}
server.on("listening", onListening);

export { app };
