import {customLocalLambdaAuthorizer} from '.';

const config = {
  localAuthorizer: {
    handlerPath: './some-path',
    handlerName: 'handler'
  }
};

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

it('should call next if IS_OFFLINE is not defined', async() => {
  const nextMock = jest.fn();

  await customLocalLambdaAuthorizer(config)({}, {}, nextMock);

  expect(nextMock).toBeCalled();
});
