//[부가서비스]

// 연관검색어 || 추천검색어
const relatedData = async (paramSet, searchResult) => {
  let response = [];

  console.log("searchResult", searchResult);
  for (let i = 0; i < searchResult.length - 1; i++) {
    console.log("searchResult", searchResult);
    let resultRec = searchResult[0].hits;
    let resultRel = searchResult[1].hits;

    if (resultRec.length > 0 || resultRel.length > 0) {
      let obj = {};
      if (resultRec.length === 0) {
        // resultRec 없을때는 resultRel -> related
        for (let cnt of resultRel) {
          obj = cnt._source.related;
        }
        response.push(obj);
      } else if (resultRec.length > 0) {
        // 값이 존재할때 -> recommend
        for (cnt of resultRec) {
          obj = cnt._source.recommend;
        }
        response.push(obj);
      }
    }
  }
  return response;
};

// [ 연관검색어 ]
//    relatedData : async(paramSet, searchResult) => {
//	result = searchResult.hits.hits;
//	let obj = {};
//	if(result.length > 0){
//	  for(cnt of result) {
//	    obj = cnt._source.related;
//	  }
//	}
//	return obj;
//    },

//자동완성 datainfo
const autoData = async (paramSet, searchResult) => {
  let result = searchResult.hits.hits;
  let response = [];

  if (result.length > 0) {
    for (let cnt of result) {
      let hfield;
      let obj = {};
      let hfieldArr = [];

      if (cnt.hasOwnProperty("highlight")) {
        let highlightObj = cnt.highlight;
        let highlightArr = [
          "keyword.autocomplete_middle",
          "keyword.autocomplete",
          "keyword.autocomplete_reverse"
        ];
        highlightArr.map(high => {
          if (Object.keys(highlightObj).includes(high))
            hfield = highlightObj[high][0];
          if (hfield !== undefined) hfieldArr.push(hfield);
        });
      }
      obj.keyword = cnt._source.keyword;
      obj.highlight = hfieldArr[0];
      obj.weight = cnt._source.weight;
      response.push(obj);
    }
  }
  return response;
};

const popData = async (paramSet, searchResult) => {
  let hits = searchResult.hits.hits;
  // let result =[];
  console.log("3434", searchResult);
  let result = {
    // timestamp: searchResult.hits.hits[0]._source.timestamp,
    result: []
  };

  if (hits.length > 0) {
    for (let element of JSON.parse(hits[0]._source.popqueryJSON)) {
      let obj = {};

      obj.rank = element.rank;
      obj.query = element.query;
      obj.count = element.count;
      obj.diff = element.diff;
      obj.updown = element.updown;
      result.result.push(obj);
    }
  }

  return result;
};

const recommendData = async (paramSet, searchResult) => {
  let hits = searchResult.hits.hits;
  // let result =[];

  return hits[0]._source;
};

export { relatedData, autoData, popData, recommendData };
