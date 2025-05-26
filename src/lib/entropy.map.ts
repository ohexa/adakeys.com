import type { EntropySize } from '@/lib/entropy.size'

export const entropyMap = new Map<EntropySize, number>([
  [12n, 128],
  [15n, 160],
  [24n, 256],
])
