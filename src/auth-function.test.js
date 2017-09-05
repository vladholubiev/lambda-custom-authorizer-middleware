import isPromise from 'is-promise';
import {getAuthFunction} from './auth-function';

it('should export getAuthFunction function', async() => {
  expect(getAuthFunction).toBeInstanceOf(Function);
});

it('should return handler function', async() => {
  const handler = getAuthFunction('./auth-handler.mock', 'handler');
  expect(handler).toBeInstanceOf(Function);
});

it('should return promisified handler function', async() => {
  const handler = getAuthFunction('./auth-handler.mock', 'handler');
  expect(isPromise(handler({}))).toBe(true);
});

it('should return response from handler', async() => {
  const handler = getAuthFunction('./auth-handler.mock', 'handler');
  const response = await handler({});

  expect(response).toEqual({a: 1});
});
