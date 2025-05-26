import * as CardanoWasm from '@emurgo/cardano-serialization-lib-browser'

import { harden, hexToBytes } from '@/lib/utils'

export const addressShelley = (hex: string) => {
  const rootKey = CardanoWasm.Bip32PrivateKey.from_bip39_entropy(
    hexToBytes(hex),
    new Uint8Array(),
  )

  const accountKey = rootKey
    .derive(harden(1852)) // purpose
    .derive(harden(1815)) // coin type
    .derive(harden(0)) // account #0

  const utxoPubKey = accountKey
    .derive(0) // external
    .derive(0)
    .to_public()

  const stakeKey = accountKey
    .derive(2) // chimeric
    .derive(0)
    .to_public()

  const baseAddr = CardanoWasm.BaseAddress.new(
    CardanoWasm.NetworkInfo.mainnet().network_id(),
    CardanoWasm.Credential.from_keyhash(utxoPubKey.to_raw_key().hash()),
    CardanoWasm.Credential.from_keyhash(stakeKey.to_raw_key().hash()),
  )

  return baseAddr.to_address().to_bech32()
}
