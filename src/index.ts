// authors: @Essam-Harrous, @neosh11

interface SearchNode {
  children: Map<string, SearchNode>;
  isEndOfWord: boolean;
  wordIds: Set<string>;
}

interface Counter {
  value: number;
}

function createSearchNode(): SearchNode {
  return { children: new Map<string, SearchNode>(), isEndOfWord: false, wordIds: new Set<string>() };
}

interface SearchOptions {
  ignoreCase?: boolean;
}

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
    return ids.map((id) => this.idToObjectMap.get(id));
  }

  clear() {
    this.autoCompleteSearch.clear();
    this.idToObjectMap.clear();
  }
}

export class AutoCompleteSearch {
  root: SearchNode;
  ignoreCase: boolean;

  // create constructor with ignore case
  constructor(options?: SearchOptions) {
    this.root = createSearchNode();
    this.ignoreCase = options?.ignoreCase ?? false;
  }

  // The time complexity of the insert method is O(m), where m is the length of the word being inserted.
  insert(word: string, id: string) {
    if (this.ignoreCase) word = word.toLowerCase();

    if (word && id) {
      let node = this.root;
      for (const char of word) {
        // lowercase the character
        if (!node.children.has(char)) {
          node.children.set(char, createSearchNode());
        }
        node = node.children.get(char)!;
      }
      node.isEndOfWord = true;
      node.wordIds.add(id);
    }
  }

  // With the counter, the time complexity of the findWords method is still O(k + n),
  // where k is the length of the prefix being searched and n is the total number of nodes in the trie.
  // This is because we still need to traverse the trie to find the nodes that match the prefix, which takes O(k) time.
  // Additionally, we may need to visit some of the nodes below the prefix nodes to collect the matching words,
  // but we stop the traversal as soon as we collect 5 words,
  // so the additional time spent in the worst case is negligible.
  // Therefore, the overall time complexity is still O(k + n).

  findWords(prefix: string, maxCount?: number): string[] {
    // lowercase the prefix and remove any leading or trailing spaces
    if (this.ignoreCase) prefix = prefix.toLowerCase();

    const ids: Set<string> = new Set();
    let node = this.root;

    for (const char of prefix) {
      if (!node.children.has(char)) {
        // convert the set to an array and return it
        return Array.from(ids);
      }
      node = node.children.get(char)!;
    }

    const count = { value: 0 };
    this.collectWords(node, ids, prefix, maxCount, count);

    return Array.from(ids);
  }

  private collectWords(
    node: SearchNode,
    ids: Set<string>,
    prefix: string = '',
    maxCount: number = 100,
    count: Counter = { value: 0 },
  ) {
    if (node.isEndOfWord) {
      for (const id of node.wordIds) {
        // check if the id is already in the set
        if (ids.has(id)) {
          continue;
        }

        // add id to the set
        ids.add(id);
        count.value++;
        if (count.value === maxCount) {
          return;
        }
      }
    }

    if (count.value < maxCount) {
      for (const [char, child] of node.children) {
        this.collectWords(child, ids, prefix + char);
        if (count.value === maxCount) {
          return;
        }
      }
    }
  }

  clear(): void {
    this.root = { children: new Map(), isEndOfWord: false, wordIds: new Set() };
  }
}
