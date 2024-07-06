export interface IComment {
  id: number;
  content: string;
  author_id: number;
  author_nickname: string;
  created_at: Date;
  updated_at?: Date | null;
  likes: number;
}
