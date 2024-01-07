import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ValueObject } from "@/core/entities/value-object";
import { Attachment } from "../attachment";

export interface IQuestionDetails {
  questionId: UniqueEntityId;
  authorId: UniqueEntityId;
  bestAnswerID?: UniqueEntityId;
  author: string;
  title: string;
  slug: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  attachments: Attachment[];
}

export class QuestionWithDetails extends ValueObject<IQuestionDetails> {
  static create(props: IQuestionDetails) {
    return new QuestionWithDetails(props);
  }

  public get questionId() {
    return this.props.questionId;
  }

  public get authorId() {
    return this.props.authorId;
  }

  public get bestAnswerID() {
    return this.props.bestAnswerID;
  }

  public get author() {
    return this.props.author;
  }

  public get title() {
    return this.props.title;
  }

  public get slug() {
    return this.props.slug;
  }

  public get content() {
    return this.props.content;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public get updatedAt() {
    return this.props.updatedAt;
  }

  public get attachments() {
    return this.props.attachments;
  }
}
