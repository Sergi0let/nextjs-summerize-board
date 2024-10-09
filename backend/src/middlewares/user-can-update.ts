"use strict";
import { Context as KoaContext, Next } from "koa"; // Assuming Koa is used
import * as _ from "lodash"

/**
 * `user-can-update` middleware
 */

interface User {
  id: number;
  // Add other relevant user properties if necessary
}

interface State {
  user?: User;
}

interface CustomContext extends KoaContext {
  state: State;
}

module.exports = (config: any, { strapi }: { strapi: any }) => {
  return async (ctx: CustomContext, next: Next) => {
    strapi.log.info("In user-can-update middleware.");

    // use lodash pick

    if (!ctx.state.user) {
      strapi.log.error("You are not authenticated.");
      return ctx.badRequest("You are not authenticated.");
    }

    const params = ctx.params as { id?: string }; // explicitly define type for params
    const requestedUserId = params.id;
    const currentUserId = ctx.state.user.id;

    if (!requestedUserId) {
      strapi.log.error("Missing user ID.");
      return ctx.badRequest("Missing or invalid user ID.");
    }

    if (Number(currentUserId) !== Number(requestedUserId)) {
      return ctx.unauthorized("You are not authorized to perform this action.");
    }

    ctx.request.body = _.pick(ctx.request.body, [
      "firstName",
      "lastName",
      "bio",
      "image",
    ]);

    await next();
  };
};
