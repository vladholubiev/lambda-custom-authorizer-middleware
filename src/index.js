import {camelCase, get, set} from 'lodash';
import {getAuthFunction} from './auth-function';

const debug = require('debug')('lambda-custom-authorizer-middleware');
let localAuthorizer;

/**
 * Express middleware function constructor to execute local lambda function
 * as a custom authorizer and attach request context to `req` object
 * as `req.apiGateway.event.requestContext.authorizer` (as for usage with `aws-serverless-exporess` npm package)
 * @param {Object} options Configuration object
 * @param {String} [options.identitySourceHeader=authorization] Name of HTTP header where auth token is located
 * @param {Object} [options.localAuthorizer={}] Local authorizer function configuration object
 * @param {String} options.localAuthorizer.handlerPath Path on local file system to the function
 * @param {String} options.localAuthorizer.handlerName Name of the exported function in provided path
 * @return {Function} Express middleware function. Works only when IS_OFFLINE env var is set.
 * @throws {Error} Throws when config is not provided
 * @example
 *
 * import express from 'express';
 * import awsSlsExpressMiddleware from 'aws-serverless-express/middleware';
 * import {customLocalLambdaAuthorizer} from 'lambda-custom-authorizer-middleware';
 *
 * const app = express();
 *
 * app.use(awsSlsExpressMiddleware.eventContext());
 * app.use(customLocalLambdaAuthorizer({ // Make sure to add after 'awsSlsExpressMiddleware'
 *  localAuthorizer: {
 *    handlerPath: '../../../../other-project/lambda/auth', // NOTE: path is relative to the package inside node_modules/
 *    handlerName: 'handler'
 *  }
 * }));
 *
 * app.get('/', (req, res) => res.json(req.apiGateway.event.requestContext.authorizer));
 */
export function customLocalLambdaAuthorizer({
  identitySourceHeader = 'authorization',
  localAuthorizer: {handlerPath, handlerName} = {}
} = {}) {
  if (!handlerPath || !handlerName) {
    throw new Error('Please provide config for customLocalLambdaAuthorizer!');
  }

  return async function(req, res, next) {
    const isOffline = Boolean(process.env.IS_OFFLINE);
    debug(`[is-offline:${isOffline}]`);

    if (!isOffline) {
      debug(`[skip]`);
      return next();
    }

    localAuthorizer = getAuthFunction(handlerPath, handlerName);

    try {
      const identitySourceValue = get(req, `headers[${camelCase(identitySourceHeader)}]`, '');

      if (!identitySourceValue) {
        debug('[warn][empty-header-value]');
      }

      const {context} = await localAuthorizer({
        authorizationToken: identitySourceValue,
        methodArn: 'lambda-custom-authorizer-middleware'
      });
      debug(`[success] %o`, context);

      set(req, 'apiGateway.event.requestContext.authorizer', context);
      debug(`[context-set:apiGateway.event.requestContext.authorizer]`);
    } catch (error) {
      debug(`[error:${error.message}] %o`, error);
      return res.status(401).json({error});
    }

    debug(`[done]`);
    return next();
  };
}
