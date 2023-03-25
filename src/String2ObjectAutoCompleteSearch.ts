// authors: @Essam-Harrous, @neosh11

import { AutoCompleteSearch } from '.';
import { SearchOptions } from './AutoCompleteSearch';

interface String2ObjectSearchOptions<T> extends SearchOptions {
  objectIdProperty: keyof T;
  tokenizer?: RegExp | string;
}

export class String2ObjectAutoCompleteSearch<T> {
  autoCompleteSearch: AutoCompleteSearch;
  idToObjectMap: Map<string, T>;
  objectIdProperty: keyof T;
  tokenizer?: RegExp | string;

  constructor(options: String2ObjectSearchOptions<T>) {
    this.autoCompleteSearch = new AutoCompleteSearch(options);
    this.idToObjectMap = new Map<string, any>();
    this.objectIdProperty = options.objectIdProperty;
    this.tokenizer = options.tokenizer;
  }

  insert(word: string, obj: T, idOverride?: keyof T) {
    // check if there is an id override
    const id = (idOverride ?? obj[this.objectIdProperty]) as string;

    if (!this.idToObjectMap.has(id)) {
      this.idToObjectMap.set(id, obj);
    }

    // split word into tokens
    if (this.tokenizer) {
      for (const w of word.split(this.tokenizer)) {
        this.autoCompleteSearch.insert(w, id);
      }
    } else {
      this.autoCompleteSearch.insert(word, id);
    }
    // check id already assigned to an object
  }

  findObjects(prefix: string, maxCount?: number) {
    const ids = this.autoCompleteSearch.findWords(prefix, maxCount);
    // return array of objects
    return ids.map((id: string) => this.idToObjectMap.get(id));
  }

  clear() {
    this.autoCompleteSearch.clear();
    this.idToObjectMap.clear();
  }
}
