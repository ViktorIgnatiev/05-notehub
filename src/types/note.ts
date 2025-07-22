export interface Note {
  _id: string;
  title: string;
  content: string;
  tags: NoteTag[];
  createdAt: string;
  updatedAt: string;
}

export type NoteTag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

export interface PaginationInfo {
  currentPage: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
}