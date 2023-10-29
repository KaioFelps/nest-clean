import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { AuthenticateStudentService } from "@/domain/forum/application/services/authenticate-student";

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller("/sessions")
export class AuthenticateController {
  constructor(private authenticateStudentService: AuthenticateStudentService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    const response = await this.authenticateStudentService.execute({
      email,
      password,
    });

    if (response.isLeft()) {
      throw new Error();
    }

    const { accessToken } = response.value;

    return { access_token: accessToken };
  }
}
