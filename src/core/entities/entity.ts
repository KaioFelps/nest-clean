import { UniqueEntityId } from "./unique-entity-id";

export class Entity<PropsType> {
  private _id: UniqueEntityId;

  // protected indica que essa propriedade só será acessível à classe entity e aquelas classes que a extendem.
  protected props: PropsType;

  get id() {
    return this._id;
  }

  protected constructor(props: PropsType, id?: UniqueEntityId) {
    this._id = id ?? new UniqueEntityId();
    this.props = props;
  }

  public equals(entity: Entity<unknown>) {
    if (entity === this) {
      return true;
    }

    if (entity.id === this._id) {
      return true;
    }

    return false;
  }
}
