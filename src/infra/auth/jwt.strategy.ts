import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Env } from "@/infra/env/env";
import { z } from "zod";

const userTokenPayloadSchema = z.object({
  sub: z.string().uuid(),
});

export type userTokenPayload = z.infer<typeof userTokenPayloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    const publicKey = config.get("JWT_PUBLIC_KEY");

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, "base64"),
      algorithms: ["RS256"],
    });
  }

  async validate(payload: userTokenPayload) {
    return userTokenPayloadSchema.parse(payload);
  }
}
