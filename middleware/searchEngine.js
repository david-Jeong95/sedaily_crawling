/*
 * IB-Class-SearchEngine
 * @extends elasticsearch.js
 * */
import elasticsearch from './elasticsearch.js';

class searchEngine extends elasticsearch {
  /*
   * Constructor
   * @param mode : Engine Type 선택 (SE or RE)
   * */
  constructor(mode) {
    super(mode);
  }
}

export default searchEngine;
