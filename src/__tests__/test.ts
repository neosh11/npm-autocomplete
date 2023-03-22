import { AutoCompleteSearch, String2ObjectAutoCompleteSearch } from '../index';

test('Test insert and find', () => {
  // create a new instance of the AutoCompleteSearch class
  const search = new AutoCompleteSearch();
  // insert a word and an id
  search.insert('John', '1');
  search.insert('John', '2');
  search.insert('Pops', '3');
  search.insert('James', '4');
  // find words that start with 'Po'
  const words2 = search.findWords('Po');
  // find words that start with 'J'
  const words3 = search.findWords('J');

  expect(words2.sort()).toEqual(['3'].sort());

  expect(words3.sort()).toEqual(['1', '2', '4'].sort());
  // clear the search
  search.clear();
  // expect the words to be an empty array
  expect(search.findWords('jo')).toEqual([]);
});

test('Lowercase test', () => {
  // create a new instance of the AutoCompleteSearch class
  const search = new AutoCompleteSearch({ ignoreCase: true });
  // insert a word and an id
  search.insert('John', '1');
  search.insert('John', '2');
  search.insert('Pops', '3');
  search.insert('James', '4');
  // find words that start with 'Jo'
  const words = search.findWords('Jo');

  // find words that start with 'Po'
  const words2 = search.findWords('pO');
  // find words that start with 'J'
  const words3 = search.findWords('j');

  expect(words.sort()).toEqual(['1', '2'].sort());
  expect(words2.sort()).toEqual(['3'].sort());
  expect(words3.sort()).toEqual(['1', '2', '4'].sort());
  // clear the search
  search.clear();
  // expect the words to be an empty array
  expect(search.findWords('jo')).toEqual([]);
});

test('Test insert and big fat find', () => {
  // create a new instance of the AutoCompleteSearch class
  const search = new AutoCompleteSearch({ ignoreCase: true });

  const arr: { id: string; word: string }[] = [];

  //    do a for loop and create 1000 words and ids between 1 and 10
  for (let i = 0; i < 1000; i++) {
    const word = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const id = Math.floor(Math.random() * 10) + 1;

    arr.push({ id: id.toString(), word: word });
    search.insert(word, id.toString());
  }

  // find words that start with 'A'
  const words1 = search.findWords('A').sort();

  // find words that start with 'A' or 'a' in arr
  const words2 = arr
    .filter((item) => item.word.startsWith('A') || item.word.startsWith('a'))
    .map((item) => item.id)
    .filter((item, index, self) => self.indexOf(item) === index)
    .sort();

  expect(words1).toEqual(words2);
});

test('String2ObjectAutoCompleteSearch', () => {
  // create a new instance of the AutoCompleteSearch class
  const search = new String2ObjectAutoCompleteSearch({
    ignoreCase: true,
    objectIdProperty: 'id',
    tokenizer: ' ',
  });

  const users = [
    {
      name: 'John Doe',
      id: '1',
    },
    {
      name: 'John Doe',
      id: '2',
    },
    {
      name: 'Pops',
      id: '3',
    },
    {
      name: 'James',
      id: '4',
    },
  ];

  const events = [
    {
      ff: 'Papi Del',
      id: 'e1',
    },
    {
      ff: 'Paa Doe',
      id: 'e2',
    },
    {
      ff: 'Jeje',
      id: 'e3',
    },
    {
      ff: 'Joe',
      id: 'e4',
    },
  ];

  for (const user of users) {
    search.insert(user.name, user);
  }

  for (const event of events) {
    search.insert(event.ff, event);
  }

  const words = search.findObjects('Jo');
  const words2 = search.findObjects('D');
  const words3 = search.findObjects('pO');
  const words4 = search.findObjects('j');
  const words5 = search.findObjects('p');

  expect(words.length).toEqual(3);
  expect(words2.length).toEqual(4);
  expect(words3).toEqual([{ name: 'Pops', id: '3' }]);
  expect(words4.length).toEqual(5);
  expect(words5.length).toEqual(3);

  // clear the search
  search.clear();
  // expect the words to be an empty array
  expect(search.findObjects('jo')).toEqual([]);
});
