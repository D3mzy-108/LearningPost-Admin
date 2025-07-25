export interface Book {
  id: string | number;
  cover: string;
  title: string;
  author: string;
  bookmark_count: number;
  chapter_count: number;
  rating: string | number;
  about: string | null;
  about_author: string | null;
  organization: string | null;
}
