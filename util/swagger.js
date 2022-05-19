"use strict";

import swaggerUi from "swagger-ui-express";
import swaggereJsdoc from "swagger-jsdoc";
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "sedaily",
      version: "1.0.0",
      description: "sedaily api"
    },
    host: "localhost:3000",
    basePath: "/",
    components: {
      res: {
        BadRequest: {
          description: "잘못된 요청.",
          schema: {
            $ref: "#/components/errorResult/Error"
          }
        },
        Forbidden: {
          description: "권한이 없음.",
          schema: {
            $ref: "#/components/errorResult/Error"
          }
        },
        NotFound: {
          description: "없는 리소스 요청.",
          schema: {
            $ref: "#/components/errorResult/Error"
          }
        }
      },
      errorResult: {
        Error: {
          type: "object",
          properties: {
            errMsg: {
              type: "string",
              description: "에러 메시지 전달."
            }
          }
        }
      }
    }
  },
  schemes: ["http", "https"], // 가능한 통신 방식
  /**
   * @swagger
   * tags:
   *   name: sedailySearch
   *   description: 검색
   * definitions:
   *   totalRequest:
   *     type: object
   *     required:
   *       - keyword
   *       - from
   *       - size
   *     properties:
   *       keyword:
   *         default: 증시
   *         type: string
   *         description: 검색어
   *       from:
   *         type: number
   *         description: 시작
   *       size:
   *          type: number
   *          description: 사이즈
   *   totalResponse:
   *     type: object
   *     required:
   *       - status
   *     properties:
   *       status:
   *         type: string
   *         description: 검색 성공 여부- error, success
   *       token:
   *         type: object
   *         description: 계정 정보
   *   Response_error:
   *     type: object
   *     required:
   *       - status
   *     properties:
   *       message:
   *         type: string
   *         description: 오류 사유
   *       status:
   *         type: integer
   *         description: response code
   */

  /**
   * @swagger
   *  paths:
   *    /search/ts:
   *      post:
   *        tags: [sedailySearch]
   *        summary: "sedaily total Search"
   *        description: "search"
   *        consumes:
   *        - "application/json"
   *        requestBody:
   *          description: 검색어 입력
   *          required: true
   *          content:
   *            application/json:
   *
   *             schema:
   *               $ref: "#/definitions/totalRequest"
   *        responses:
   *          200:
   *            description: "검색 결과"
   *            schema:
   *              $ref: "#/definitions/totalResponse"
   */

  apis: ["./util/swagger.js"]
};
const specs = swaggereJsdoc(options);

export { swaggerUi, specs };

//get 방식
// parameters:
//    *        - in: "query"
//    *          name: "query"
//    *          description: "검색"
//    *          required: true
//    *          schema:
//    *            $ref: "#/definitions/totalRequest"

//content-type
//x-www-form-urlencoded
