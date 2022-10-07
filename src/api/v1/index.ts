import { FastifyPluginAsync } from 'fastify';
import { fetch_buyer } from './plugins/fetch_buyer';
import { verify_firebase_id_token } from './plugins/verify_firebase_id_token';

import * as index from './routes';

export const v1: FastifyPluginAsync = async (instance, _opts) => {
  instance.decorateRequest('decoded_token', null);

  instance.route({
    url: '/',
    method: 'GET',
    preHandler: verify_firebase_id_token,
    handler: index.GET_handler,
  });

  instance.route({
    url: '/',
    method: 'POST',
    preHandler: verify_firebase_id_token,
    handler: index.POST_handler,
  });

  instance.route({
    url: '/addresses',
    method: 'GET',
    preHandler: [
      verify_firebase_id_token,
      fetch_buyer,
    ],
    handler: index.addresses.GET_handler,
  });

  instance.route({
    url: '/addresses',
    method: 'POST',
    schema: index.addresses.POST_validation_schema,
    preHandler: [
      verify_firebase_id_token,
      fetch_buyer,
    ],
    handler: index.addresses.POST_handler,
  });
};
