import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { userTokenPayload } from "./jwt.strategy";

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return request.user as userTokenPayload;
  },
);
