import { RouteHandlerMethod } from 'fastify';
import { LeanDocument } from 'mongoose';
import { addresses } from '../../../../db/addresses';
import { ADDRESSES_SCHEMA } from '../../../../db/addresses/types';
import { BUYERS_SCHEMA } from '../../../../db/buyers/types';

export const GET_handler: RouteHandlerMethod = async (request, reply) => {
  // @ts-ignore
  const user = request.user as LeanDocument<BUYERS_SCHEMA & { _id: any }>;

  let fetch_res: LeanDocument<ADDRESSES_SCHEMA & { _id: any }>;

  try {
    fetch_res = await addresses
      .find({
        buyer_id: user._id,
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

  reply.status(200).send(fetch_res);
};
