/* eslint-disable */
import { toError, toPayload } from '../jsonrpc';
import EventNames from '../events';
import debugLogger from 'debug';
const debug = debugLogger('MEWconnectWeb3');
const debugErrors = debugLogger('MEWconnectError');

export default async ({ payload, eventHub }, res, next) => {
  if (payload.method !== 'eth_decrypt') return next();
  try {
    debug(payload.params[0]); // todo remove dev item
    eventHub.emit(EventNames.DECRYPT, payload.params, _response => {
      if (_response.reject) {
        debug('USER DECLINED SIGN TRANSACTION');
        res(toError(payload.id, 'User Rejected Request', 4001));
        return;
      }
      debug('decrypt response', payload.method, _response);
      res(null, toPayload(payload.id, _response));
    });
  } catch (e) {
    debugErrors(e);
    debugErrors('Error: eth_decrypt', e);
    res(e);
  }
};
