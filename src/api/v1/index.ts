import { FastifyPluginAsync } from "fastify";
import { verify_firebase_id_token } from "./plugins/verify_firebase_id_token";

import * as index from './routes';

export const v1: FastifyPluginAsync = async (instance, _opts) => {
  instance.decorateRequest('decodedToken', null);

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
}