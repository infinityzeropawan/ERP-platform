import { z } from 'zod';

// We will add schemas here as we refactor student pages like profile editing, assignments submission, etc.
export const dummyStudentSchema = z.object({
  id: z.string(),
});
