import * as CardanoWasm from '@emurgo/cardano-serialization-lib-browser'

import { harden, hexToBytes } from '@/lib/utils'

export const addressIcarus = (hex: string) => {
  const rootKey = CardanoWasm.Bip32PrivateKey.from_bip39_entropy(
    hexToBytes(hex),
    new Uint8Array(),
  )

  const accountKey = rootKey
    .derive(harden(44)) // purpose
    .derive(harden(1815)) // coin type
    .derive(harden(0)) // account #0

  const utxoPubKey = accountKey
    .derive(0) // external
    .derive(0)
    .to_public()

  const byronAddr = CardanoWasm.ByronAddress.icarus_from_key(
    utxoPubKey, // Ae2* style icarus address
    CardanoWasm.NetworkInfo.mainnet().protocol_magic(),
  )

  return byronAddr.to_base58()
}
