import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionWithDetails } from "@/domain/forum/enterprise/entities/value-objects/question-with-details";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import {
  Question as PrismaQuestion,
  User as PrismaUser,
  Attachment as PrismaAttachment,
} from "@prisma/client";
import { PrismaAttachmentMapper } from "./prisma-attachment-mapper";

type PrismaQuestionWithDetails = PrismaQuestion & {
  author: PrismaUser;
  attachments: PrismaAttachment[];
};

export class PrismaQuestionWithDetailsMapper {
  static toDomain(
    prismaQuestionWithDetails: PrismaQuestionWithDetails,
  ): QuestionWithDetails {
    const domainQuestionWithDetails: QuestionWithDetails =
      QuestionWithDetails.create({
        author: prismaQuestionWithDetails.author.name,
        authorId: new UniqueEntityId(prismaQuestionWithDetails.authorId),
        createdAt: prismaQuestionWithDetails.createdAt,
        updatedAt: prismaQuestionWithDetails.updatedAt ?? undefined,
        content: prismaQuestionWithDetails.content,
        slug: Slug.create(prismaQuestionWithDetails.slug),
        attachments: prismaQuestionWithDetails.attachments.map(
          PrismaAttachmentMapper.toDomain,
        ),
        questionId: new UniqueEntityId(prismaQuestionWithDetails.id),
        title: prismaQuestionWithDetails.title,
        bestAnswerID: prismaQuestionWithDetails.bestAnswerId
          ? new UniqueEntityId(prismaQuestionWithDetails.bestAnswerId)
          : undefined,
      });

    return domainQuestionWithDetails;
  }
}
