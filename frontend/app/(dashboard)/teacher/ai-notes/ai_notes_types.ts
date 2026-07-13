export interface AiNotesError {
  code: string;
  message: string;
}

export interface AiNotesGeneratePayload {
  topic: string;
  subject: string;
  style: string;
}

export interface AiNotesGenerateResponse {
  content: string;
  provider: string;
  error?: string;
  message?: string;
}
