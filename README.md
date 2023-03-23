# npm-autocomplete

## Overview

This TypeScript module provides a simple implementation of an auto-complete search using a trie data structure. It supports searching for words with a given prefix and inserting words with associated IDs into the trie. The module also provides an option for case-insensitive search

| Function                                       | Time                                                                      |
| ---------------------------------------------- | ------------------------------------------------------------------------- |
| `insert(word: string, id: string)`             | `O(m)`, where m is the length of the word being inserted.                 |
| `findWords(prefix: string, maxCount?: number)` | `O(k + n)`, where n is the number of nodes, k is the lenght of the prefix |


## Why use this and not a simple filter?

We tested out a simple filter on 100,000 tokens on the browser and these were the results:

| Method                                       | Time  (ms)                                                                    |
| ---------------------------------------------- | ------------------------------------------------------------------------- |
| Simple filter            | 467              |
| autoCompleteSearch | 4 |

If you want your results to instantly load as you're typing with a lot of data, this library will be a life saver!


## Usage

### install

```
# if using yarn
yarn add @neosh11/autocomplete-search

# if using npm
npm install @neosh11/autocomplete-search
```

## AutoCompleteSearch

### Importing the module

```ts
import { AutoCompleteSearch } from '@neosh11/autocomplete-search';
```

### Initializing the AutoCompleteSearch

To create an instance of `AutoCompleteSearch`, use the constructor and pass an optional `SearchOptions` object:

```ts
const searchOptions = { ignoreCase: true };
const autoCompleteSearch = new AutoCompleteSearch(searchOptions);
```

The `ignoreCase` option, if set to `true`, will perform case-insensitive search and insertions.

### Inserting words

To insert words into the trie, use the `insert` method:

```ts
autoCompleteSearch.insert('example', 'id123');
```

This inserts the word "example" with the associated ID "id123" into the trie.

### Searching for words

To search for words with a given prefix, use the `findWords` method:

```ts
const results = autoCompleteSearch.findWords('exa', 5);
```

This searches for words with the prefix "exa" and returns up to 5 associated IDs in an array.

By default, the maximum number of ids returned is 100

## String2ObjectAutoCompleteSearch

### Importing the module

```ts
import { String2ObjectAutoCompleteSearch } from '@neosh11/autocomplete-search';
```

### Initializing the AutoCompleteSearch

To create an instance of `AutoCompleteSearch`, use the constructor and pass an optional `SearchOptions` object:

```ts
const searchOptions = {
  ignoreCase: true,
  objectIdProperty: 'id',
  tokenizer: ' ',
};
const autoCompleteSearch = new AutoCompleteSearch(searchOptions);
```

The `ignoreCase` option, if set to `true`, will perform case-insensitive search and insertions.

The `objectIdProperty` option will examine which property to use as a unique ID

The `tokenizer` option, if used will tokenize the search string

### Inserting words

To insert words into the trie, use the `insert` method:

```ts
autoCompleteSearch.insert('example', object);
```

This inserts the `object` with the word 'example'.

### Searching for words

To search for words with a given prefix, use the `findWords` method:

```ts
const results = autoCompleteSearch.findObjects('exa', 5);
```

This searches for words with the prefix "exa" and returns up to 5 associated objects which match this description.

By default, the maximum number of ids returned is 100
