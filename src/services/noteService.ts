import axios from "axios";
import type { Note, NoteTag } from "../types/note";


axios.defaults.baseURL = "https://notehub-public.goit.study/api";
const token = import.meta.env.VITE_NOTEHUB_TOKEN;
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;


if (!token) {
  throw new Error('VITE_NOTEHUB_TOKEN is not defined. Please check your .env configuration.');
};


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
      url: error.config?.url
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
  total_pages: number;
  perPage: number;
}

interface RawFetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await axios.get<RawFetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      ...(search && { search }), 
    },
  });

  return {
    page,
    perPage,
    data: response.data.notes,
    total_pages: response.data.totalPages,
  };
};

export const createNote = async (note: {
  title: string;
  content: string;
  tag: NoteTag;
}): Promise<Note> => {
  const response = await axios.post<Note>('/notes', note);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`/notes/${id}`);
  return response.data;
};