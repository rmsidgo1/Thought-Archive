export interface Note {
  slug: string;
  title: string;
  tags: string[];
  created?: string;
  updated?: string;
  links: string[];
  backlinks: string[];
  readingTime: number;
}
