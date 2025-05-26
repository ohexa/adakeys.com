import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type { ClassValue } from 'clsx'

export const cn = (...inputs: Array<ClassValue>) => {
  return twMerge(clsx(inputs))
}

export const harden = (n: number) => {
  return 0x80000000 + n
}

export const hexToBytes = (hex: string) => {
  if (hex.length % 2 !== 0) throw new Error('Invalid hex string')
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes
}
