import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";

describe("Fetch latest questions (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  function createSlugFromTitle(title) {
    return title
      .toLowerCase()
      .normalize("NFD")
      .trimStart()
      .trimEnd()
      .replaceAll(" ", "_")
      .replaceAll(/__+/g, "");
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /questions", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Kaio Felipe",
        email: "kaiolacradorlacrademaispracaralho@lacre.karolconka",
        password: await hash(
          "kaioconkamamacitalacrantelacradora@2023atualizadosemanuncio",
          8,
        ),
      },
    });

    await prisma.question.createMany({
      data: [
        {
          title: "Sair do jogo",
          content: "Olá, bom dia!\n Quer sair do jogo?",
          authorId: user.id,
          slug: createSlugFromTitle("Sair do jogo"),
        },
        {
          title: "Por que o nordeste está sendo dominado pela juliete?",
          content:
            "Li uma notícia no G1 que a jojo todynho falou que a juliete tá escravizando todo mundo e fazendo eles viverem de tapioca.",
          authorId: user.id,
          slug: createSlugFromTitle(
            "Por que o nordeste está sendo dominado pela juliete?",
          ),
        },
        {
          title: "como eu faço pra criar uma pergunta",
          content: "não consigo criar uma pergunta",
          authorId: user.id,
          slug: createSlugFromTitle("como eu faço pra criar uma pergunta"),
        },
      ],
    });

    const accessToken = await jwt.sign({ sub: user.id });

    const response = await request(app.getHttpServer())
      .get("/questions")
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(3);
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        title: "Sair do jogo",
        content: "Olá, bom dia!\n Quer sair do jogo?",
      }),
    );
  });
});
