import {customLocalLambdaAuthorizer} from '.';
import {handler as mockHandler} from './auth-handler.mock';

const config = {
  localAuthorizer: {
    handlerPath: './auth-handler.mock',
    handlerName: 'handler'
  }
};

beforeEach(() => {
  process.env.IS_OFFLINE = 'true';
});

afterEach(() => {
  delete process.env.IS_OFFLINE;
});

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
  delete process.env.IS_OFFLINE;
  const nextMock = jest.fn();

  await customLocalLambdaAuthorizer(config)({}, {}, nextMock);

  expect(nextMock).toBeCalled();
});

it('should call mock handler w/ token from default header', async() => {
  await customLocalLambdaAuthorizer(config)({headers: {authorization: 'my-token'}}, {}, jest.fn());

  expect(mockHandler).toBeCalledWith({
    authorizationToken: 'my-token',
    methodArn: 'lambda-custom-authorizer-middleware'
  }, {}, expect.any(Function));
});

it('should call mock handler w/ token from non-standard header', async() => {
  await customLocalLambdaAuthorizer({
    identitySourceHeader: 'customHeader',
    localAuthorizer: {
      handlerPath: './auth-handler.mock',
      handlerName: 'handler'
    }
  })({headers: {customHeader: 'my-custom-token'}}, {}, jest.fn());

  expect(mockHandler).toBeCalledWith({
    authorizationToken: 'my-custom-token',
    methodArn: 'lambda-custom-authorizer-middleware'
  }, {}, expect.any(Function));
});

it('should call next if all is ok', async() => {
  const nextMock = jest.fn();
  await customLocalLambdaAuthorizer(config)({}, {}, nextMock);

  expect(nextMock).toBeCalled();
});

it('should response w/ status code 401 in case thrown from authorizer', async() => {
  const respMock = {status: jest.fn(() => ({json: jest.fn()}))};
  const error = new Error('something happened');
  mockHandler.mockImplementationOnce((_, __, cb) => cb(error));

  await customLocalLambdaAuthorizer(config)({}, respMock, jest.fn());
  expect(respMock.status).toBeCalledWith(401);
});

it('should response w/ error in case thrown from authorizer', async() => {
  const jsonMock = jest.fn();
  const respMock = {status: () => ({json: jsonMock})};
  const error = new Error('something happened');
  mockHandler.mockImplementationOnce((_, __, cb) => cb(error));

  await customLocalLambdaAuthorizer(config)({}, respMock, jest.fn());
  expect(jsonMock).toBeCalledWith({error});
});
