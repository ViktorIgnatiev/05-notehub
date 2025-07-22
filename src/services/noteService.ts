import axios, { AxiosResponse } from 'axios';
import { Note, NoteTag, PaginationInfo } from '../types/note';

const API_BASE_URL = 'https://notehub-public.goit.study/api';

// Отримання токену з змінних оточення
const NOTEHUB_TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

if (!NOTEHUB_TOKEN) {
  console.error('VITE_NOTEHUB_TOKEN is not defined. Please set your NoteHub API token in your .env file.');
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${NOTEHUB_TOKEN}`,
  },
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  pagination: PaginationInfo;
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = '',
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  try {
    const response: AxiosResponse<FetchNotesResponse> = await axiosInstance.get('/notes', {
      params: {
        page,
        perPage,
        ...(search && { search }), // Додаємо search тільки якщо він є
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching notes:', error.response?.data || error.message);
    } else {
      console.error('An unexpected error occurred:', error);
    }
    throw error;
  }
};

export interface CreateNoteParams {
  title: string;
  content: string;
  tags: NoteTag[];
}

export const createNote = async (noteData: CreateNoteParams): Promise<Note> => {
  try {
    const response: AxiosResponse<Note> = await axiosInstance.post('/notes', noteData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error creating note:', error.response?.data || error.message);
    } else {
      console.error('An unexpected error occurred:', error);
    }
    throw error;
  }
};

export interface DeleteNoteResponse {
  message: string;
  deletedId: string;
}

export const deleteNote = async (id: string): Promise<DeleteNoteResponse> => {
  try {
    const response: AxiosResponse<DeleteNoteResponse> = await axiosInstance.delete(`/notes/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error deleting note:', error.response?.data || error.message);
    } else {
      console.error('An unexpected error occurred:', error);
    }
    throw error;
  }
};