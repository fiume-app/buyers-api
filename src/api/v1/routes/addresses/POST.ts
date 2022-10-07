import { JSONSchemaType } from 'ajv';
import { FastifySchema, RouteHandlerMethod } from 'fastify';
import { LeanDocument } from 'mongoose';
import { addresses } from '../../../../db/addresses';
import { ADDRESSES_SCHEMA } from '../../../../db/addresses/types';
import { BUYERS_SCHEMA } from '../../../../db/buyers/types';

export interface PostBody {
  line1: string,
  line2?: string,
  city: string,
  state: string,
  pin_code: string,
}

const body_schema: JSONSchemaType<PostBody> = {
  type: 'object',
  properties: {
    line1: {
      type: 'string',
      maxLength: 128,
    },
    line2: {
      type: 'string',
      maxLength: 128,
      nullable: true,
    },
    city: {
      type: 'string',
      maxLength: 128,
    },
    state: {
      type: 'string',
      maxLength: 128,
    },
    pin_code: {
      type: 'string',
      maxLength: 6,
      minLength: 6,
    },
  },
  required: [
    'line1',
    'city',
    'state',
    'pin_code',
  ],
  additionalProperties: false,
};

export const POST_validation_schema: FastifySchema = {
  body: body_schema,
};

export const POST_handler: RouteHandlerMethod = async (request, reply) => {
  const body = request.body as PostBody;

  // @ts-ignore
  const user = request.user as LeanDocument<BUYERS_SCHEMA & { _id: any }>;

  let create_res: ADDRESSES_SCHEMA & { _id: any };

  try {
    create_res = await addresses
      .create({
        ...body,
        buyer_id: user._id,
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
