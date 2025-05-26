import { z } from 'zod'

export const keysSearch = z.object({
  style: z.enum(['ae2td', 'addr1']),
  page: z.number().default(1),
  entropySize: z.number().default(12),
})

export type KeysSearch = z.infer<typeof keysSearch>
