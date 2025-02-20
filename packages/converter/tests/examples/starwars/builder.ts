import SchemaBuilder from '@pothos/core';
import type { Character, ContextType, Droid, Human } from './backing-models';

export interface Types {
  Objects: { Droid: Droid; Human: Human; String: string };
  Interfaces: { Character: Character };
  Context: ContextType;
}

export default new SchemaBuilder<Types>({});
