import {customLocalLambdaAuthorizer} from '.';

it('should export customLocalLambdaAuthorizer function', () => {
  expect(customLocalLambdaAuthorizer).toBeInstanceOf(Function);
});

it('should throw if config not provided', async() => {
  expect.assertions(1);
  try {
    await customLocalLambdaAuthorizer()({}, {}, jest.fn());
  } catch (error) {
    expect(error.message).toBe('Please provide config for customLocalLambdaAuthorizer!');
  }
});
