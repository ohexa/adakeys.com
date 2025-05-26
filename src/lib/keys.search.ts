import { z } from 'zod'

export const keysSearch = z.object({
  style: z.enum(['ae2td', 'addr1']),
  hex: z.string().default('00000000000000000000000000000000'),
  size: z.number().default(12),
})

export type KeysSearch = z.infer<typeof keysSearch>
