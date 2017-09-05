export const handler = jest.fn((event, context, cb) => cb(null, Promise.resolve({a: 1})));
