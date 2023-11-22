import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { AuthenticateStudentService } from "@/domain/forum/application/services/authenticate-student";
import { WrongCredentialsError } from "@/domain/forum/application/services/errors/wrong-credentials-error";
import { PublicRoute } from "@/infra/auth/public-route-decorator";

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller("/sessions")
export class AuthenticateController {
  constructor(private authenticateStudentService: AuthenticateStudentService) {}

  @Post()
  @PublicRoute()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    const response = await this.authenticateStudentService.execute({
      email,
      password,
    });

    if (response.isLeft()) {
      const error = response.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
          break;
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = response.value;

    return { access_token: accessToken };
  }
}
