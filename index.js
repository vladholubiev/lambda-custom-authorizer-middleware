import {set} from 'lodash';

let localAuthorizer;

export function customLocalLambdaAuthorizer({localAuthorizer: {handlerPath, handlerName} = {}} = {}) {
  if (!handlerPath || !handlerName) {
    throw new Error('Please provide config for customLocalLambdaAuthorizer!');
  }

  return async function(req, res, next) {
    if (!Boolean(process.env.IS_OFFLINE)) {
      return next();
    }


  };
}
