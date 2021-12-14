import { Object } from './objects.interface';

export interface Image {
  id: number;
  label: string;
  path: string;
  analyze: boolean;
  objects: Object[];
}

export interface ImageRO {
  id: number;
  label: string;
  path: string;
  analyze: boolean;
  objects: string[];
}
