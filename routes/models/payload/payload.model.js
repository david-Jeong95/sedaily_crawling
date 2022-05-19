// Basic Template Elasticsearch Query
import esQryMaker from "elastic-builder";
import { getEmpty } from "../../../util/util.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const index_config = require("../../../config/es_index_conf.json");
const ser_index_config = require("../../../config/service_index_config.json");

const getMainQuery = async params => {
  // 키워드 체크
  let keywordStr = params.keyword;
  const query = {
    index: index_config.all.index,
    body: {
      size: params.size, //size 설정
      from: (params.from - 1) * params.size, //페이징 처리
      query: {
        bool: {
          must: [
            {
              query_string: {
                fields: index_config.all.field.searchField,
                query: keywordStr
              }
            }
          ]
        }
      }
    }
  };
  console.log("queryy", query.body.query.bool.must[0].query_string);
  //return 검색 쿼리

  return query;
};

const autocomplete = async req => {
  // 키워드 체크
  // console.log("req", req);
  const query = {
    query: {
      bool: {
        must: {
          multi_match: {
            query: req.keyword,
            fields: ser_index_config[req.gatewayService].field.searchField
          }
        }
      }
    },
    highlight: {
      fields: {
        "keyword.autocomplete*": {}
      }
    },
    sort: [
      {
        _score: "desc"
      },
      {
        weight: "desc"
      },
      {
        "keyword.keyword": "asc"
      }
    ]
  };
  console.log("query", JSON.stringify(query));
  //return 검색 쿼리

  return query;
};

const related = async req => {
  // 키워드 체크
  // console.log("req", req);
  const query = {
    query: {
      bool: {
        must: [
          {
            match: {
              "keyword.keyword": req.keyword
            }
          },
          {
            match: {
              label: req.label
            }
          }
        ]
      }
    },
    sort: [
      {
        timestamp: {
          order: "asc"
        }
      }
    ]
  };
  console.log("query", JSON.stringify(query));
  //return 검색 쿼리

  return query;
};

const popquery = async req => {
  // 키워드 체크
  // console.log("req", req);
  const query = {
    query: {
      term: {
        label: {
          value: req.label
        }
      }
    },
    sort: [
      {
        timestamp: {
          order: "desc"
        }
      }
    ],
    size: 10
  };
  console.log("query", JSON.stringify(query));
  //return 검색 쿼리

  return query;
};

const recommend = async req => {
  // 키워드 체크
  // console.log("req", req);
  const query = {
    query: {
      bool: {
        must: [
          {
            match: {
              "keyword.keyword": req.keyword
            }
          },
          {
            match: {
              label: req.label
            }
          }
        ]
      }
    },
    sort: [
      {
        timestamp: {
          order: "asc"
        }
      }
    ],
    size: 10
  };
  console.log("query", JSON.stringify(query));
  //return 검색 쿼리

  return query;
};

export { getMainQuery, autocomplete, related, popquery, recommend };
