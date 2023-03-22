// authors: @Essam-Harrous, @neosh11

import { AutoCompleteSearch } from '.';
import { SearchOptions } from './AutoCompleteSearch';

interface String2ObjectSearchOptions extends SearchOptions {
  objectIdProperty: string;
  tokenizer?: RegExp | string;
}

export class String2ObjectAutoCompleteSearch {
  autoCompleteSearch: AutoCompleteSearch;
  idToObjectMap: Map<string, any>;
  objectIdProperty: string;
  tokenizer?: RegExp | string;

  constructor(options: String2ObjectSearchOptions) {
    this.autoCompleteSearch = new AutoCompleteSearch(options);
    this.idToObjectMap = new Map<string, any>();
    this.objectIdProperty = options.objectIdProperty;
    this.tokenizer = options.tokenizer;
  }

  insert(word: string, obj: any, idOverride?: string) {
    // check if there is an id override
    const id = idOverride ?? obj[this.objectIdProperty];

    if (!this.idToObjectMap.has(id)) {
      this.idToObjectMap.set(id, obj);
    }

    let words = [word];
    // split word into tokens
    if (this.tokenizer) {
      words = word.split(this.tokenizer);
    }
    // check id already assigned to an object

    // add all tokens to the search
    for (const w of words) {
      this.autoCompleteSearch.insert(w, id);
    }
  }

  findObjects(prefix: string, maxCount?: number): any[] {
    const ids = this.autoCompleteSearch.findWords(prefix, maxCount);
    // return array of objects
    return ids.map((id: string) => this.idToObjectMap.get(id));
  }

  clear() {
    this.autoCompleteSearch.clear();
    this.idToObjectMap.clear();
  }
}
