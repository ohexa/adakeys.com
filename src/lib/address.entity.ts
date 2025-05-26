import { z } from 'zod'

export const addressEntity = z.object({
  hexadecimal: z.string(),
  address: z.string(),
})

export type AddressEntity = z.infer<typeof addressEntity>
