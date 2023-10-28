import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface IInstructor {
  name: string;
}

export class Instructor extends Entity<IInstructor> {
  get name() {
    return this.props.name;
  }

  static create(props: IInstructor, id?: UniqueEntityId) {
    const instructor = new Instructor(props, id);

    return instructor;
  }
}
