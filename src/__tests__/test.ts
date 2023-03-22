import { HelloPerson } from '../index';
test('Hello Person', () => {
  expect(HelloPerson('John')).toBe('Hello John');
});
