import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ValueObject } from "@/core/entities/value-object";

export interface ICommentsWithAuthor {
  commentId: UniqueEntityId;
  authorId: UniqueEntityId;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class CommentWithAuthor extends ValueObject<ICommentsWithAuthor> {
  static create(props: ICommentsWithAuthor) {
    return new CommentWithAuthor(props);
  }

  get commentId() {
    return this.props.commentId;
  }

  get authorId() {
    return this.props.authorId;
  }

  get author() {
    return this.props.author;
  }

  get content() {
    return this.props.content;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
