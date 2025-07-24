import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const API_BASE_URL = 'https://notehub-public.goit.study/api';
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

if (!token) {
  console.error('VITE_NOTEHUB_TOKEN is not defined. Please set your NoteHub API token in your .env file.');
  throw new Error('VITE_NOTEHUB_TOKEN is not defined. Please check your .env configuration.');
}

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

axios.interceptors.request.use(config => {
  console.log('Making request to:', config.url);
  return config;
});

axios.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  page: number;
  data: Note[];
  totalPages: number;
  perPage: number;
  total: number;
}

interface RawFetchNotesResponse {
  notes: Note[];
  totalPages: number;
  total: number;
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const requestParams: Record<string, any> = {
    page,
    perPage,
  };

  if (search) {
    requestParams.search = search;
  }

  const response = await axios.get<RawFetchNotesResponse>('/notes', {
    params: requestParams,
  });

  return {
    page,
    perPage,
    data: response.data.notes,
    totalPages: response.data.totalPages,
    total: response.data.total,
  };
};

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

export const createNote = async (noteData: CreateNoteParams): Promise<Note> => {
  const response = await axios.post<Note>('/notes', noteData);
  return response.data;
};

export const deleteNote = async (id: number): Promise<void> => {
  await axios.delete<void>(`${API_BASE_URL}/notes/${id}`);
};
