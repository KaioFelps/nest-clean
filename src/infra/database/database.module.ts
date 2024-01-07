import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaAnswersRepository } from "./prisma/repositories/prisma-answers-repository";
import { PrismaAnswerCommentsRepository } from "./prisma/repositories/prisma-answer-comments-repository";
import { PrismaAnswerAttachmentsRepository } from "./prisma/repositories/prisma-answer-attachments-repository";
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-questions-repository";
import { PrismaQuestionCommentsRepository } from "./prisma/repositories/prisma-question-comments-repository";
import { PrismaQuestionAttachmentsRepository } from "./prisma/repositories/prisma-question-attachments-repository";
import { PrismaNotificationsRepository } from "./prisma/repositories/prisma-notifications-repository";
import { IQuestionRepository } from "@/domain/forum/application/repositories/question-repository";
import { IStudentRepository } from "@/domain/forum/application/repositories/student-repository";
import { PrismaStudentsRepository } from "./prisma/repositories/prisma-students-repository";
import { IAnswerRepository } from "@/domain/forum/application/repositories/answer-repository";
import { IAnswerCommentRepository } from "@/domain/forum/application/repositories/answer-comment-repository";
import { IAnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachment-repository";
import { IQuestionCommentRepository } from "@/domain/forum/application/repositories/question-comment-repository";
import { IQuestionAttachmentRepository } from "@/domain/forum/application/repositories/question-attachment-repository";
import { IAttachmentRepository } from "@/domain/forum/application/repositories/attachment-repository";
import { PrismaAttachmentsRepository } from "./prisma/repositories/prisma-attachments-repository";
import { INotificationRepository } from "@/domain/notification/application/repositories/notification-repository";

@Module({
  providers: [
    PrismaService,
    {
      provide: IAnswerRepository,
      useClass: PrismaAnswersRepository,
    },
    {
      provide: IAnswerCommentRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    {
      provide: IAnswerAttachmentRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
    {
      provide: IQuestionRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: IStudentRepository,
      useClass: PrismaStudentsRepository,
    },
    {
      provide: IQuestionCommentRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: IQuestionAttachmentRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
    {
      provide: IAttachmentRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: INotificationRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  // quando se usa o exports, todo módulo que importar este módulo terá acesso ao que este módulo está exportando
  exports: [
    PrismaService,
    IAnswerRepository,
    IAnswerCommentRepository,
    IAnswerAttachmentRepository,
    IQuestionRepository,
    IStudentRepository,
    IQuestionCommentRepository,
    IQuestionAttachmentRepository,
    IAttachmentRepository,
    INotificationRepository,
  ],
})
export class DatabaseModule {}
