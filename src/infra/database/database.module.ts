import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaAnswersRepository } from "./prisma/repositories/prisma-answers-repository";
import { PrismaAnswerCommentsRepository } from "./prisma/repositories/prisma-answer-comments-repository";
import { PrismaAnswerAttachmentsRepository } from "./prisma/repositories/prisma-answer-attachments-repository";
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-questions-repository";
import { PrismaQuestionCommentsRepository } from "./prisma/repositories/prisma-question-comments-repository";
import { PrismaQuestionAttachmentsRepository } from "./prisma/repositories/prisma-question-attachments-repository";
import { PrismaNotificationsRepository } from "./prisma/repositories/prisma-notifications-repository";
import { IQuestionRepository } from "@/domain/forum/application/repositories/question-repository-interface";

@Module({
  providers: [
    PrismaService,
    PrismaAnswersRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswerAttachmentsRepository,
    { provide: IQuestionRepository, useClass: PrismaQuestionsRepository },
    PrismaQuestionCommentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaNotificationsRepository,
  ],
  // quando se usa o exports, todo módulo que importar este módulo terá acesso ao que este módulo está exportando
  exports: [
    PrismaService,
    PrismaAnswersRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswerAttachmentsRepository,
    IQuestionRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaNotificationsRepository,
  ],
})
export class DatabaseModule {}
