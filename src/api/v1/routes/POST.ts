import { RouteHandlerMethod } from 'fastify';
import { DecodedIdToken } from 'firebase-admin/auth';
import { LeanDocument } from 'mongoose';
import { buyers } from '../../../db/buyers';
import { BUYERS_SCHEMA } from '../../../db/buyers/types';

export const POST_handler: RouteHandlerMethod = async (request, reply) => {
  // @ts-ignore
  const decoded_token = request.decoded_token as DecodedIdToken;

  let fetch_res: LeanDocument<BUYERS_SCHEMA & { _id: any }> | null;

  try {
    fetch_res = await buyers
      .findOne({
        email: decoded_token.email,
      })
      .lean();
  } catch (e) {
    reply.status(500).send({
      type: 'DATABASE_ERROR',
      msg: 'Unable to perform Operation',
      error: e,
    });
    return;
  }

  if (fetch_res) {
    reply.send(fetch_res);
    return;
  }

  let create_res: BUYERS_SCHEMA;

  try {
    create_res = await buyers
      .create({
        name: decoded_token.name,
        email: decoded_token.email,
        quarantined: false,
        banned: false,
      });
  } catch (e) {
    reply.status(500).send({
      type: 'DATABASE_ERROR',
      msg: 'Unable to perform Operation',
      error: e,
    });
    return;
  }

  reply.status(200).send(create_res.toObject());
};
