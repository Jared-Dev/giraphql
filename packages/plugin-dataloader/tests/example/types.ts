import type DataLoader from 'dataloader';
import type { LoadableRef } from '../../src';

export interface IPost {
  id: number;
  title: string;
  content: string;
}

export interface ContextType {
  id: number;
  userLoader: DataLoader<string, { id: number }>;
  getLoader: <K, V>(ref: LoadableRef<K, V, ContextType>) => DataLoader<K, V>;
  load: <K, V>(ref: LoadableRef<K, V, ContextType>, id: K) => Promise<V>;
  loadMany: <K, V>(ref: LoadableRef<K, V, ContextType>, ids: K[]) => Promise<(Error | V)[]>;
  callCounts: Map<string, number>;
  countCall: (name: string) => void;
}
