// classes abstratas não podem ser instanciadas como `new Class()`, mas podemos instanciar classes que a herdam.

import { DomainEvent } from "../events/domain-event";
import { DomainEvents } from "../events/domain-events";
import { Entity } from "./entity";

export abstract class AggregateRoot<Props> extends Entity<Props> {
  private _domainEvents: DomainEvent[] = [];

  getDomainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  /**
   * A diferença de um método protegido pra um método privado é que ele só poderá ser acessado pelas classes que herdam essa classe
   */
  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);

    DomainEvents.markAggregateForDispatch(this);
  }

  public clearEvents() {
    this._domainEvents = [];
  }
}
