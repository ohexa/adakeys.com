import { useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'
import { mnemonicToEntropy } from 'web-bip39'
import wordlist from 'web-bip39/wordlists/english'

import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const navigate = Route.useNavigate()
  const [value, setValue] = useState<string>('')

  const search = async () => {
    let hex: string

    try {
      hex = Array.from(await mnemonicToEntropy(value, wordlist))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
    } catch (error) {
      console.error(error)
      // If not mnemonic, assume input is hex string already
      // Validate hex string length (e.g. must be even length and valid hex)
      const cleaned = value.trim()
      const isValidHex =
        /^[0-9a-fA-F]+$/.test(cleaned) && cleaned.length % 2 === 0

      if (isValidHex) {
        hex = cleaned.toLowerCase()
      } else {
        alert(
          'Invalid input: please enter a valid BIP39 mnemonic or hex string ' +
            value,
        )
        return
      }
    }

    const entropyBytes = hex.length / 2
    const entropyBits = entropyBytes * 8
    const checksumBits = entropyBits / 32
    const totalBits = entropyBits + checksumBits
    const size = totalBits / 11

    navigate({
      from: '/',
      to: '/keys',
      search: {
        style: 'addr1',
        hex,
        size,
      },
    })
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      search()
    }
  }

  return (
    <main className="flex flex-col gap-8">
      <section className="space-y-4">
        <h2 className="text-xl font-black">Search</h2>
        <Input
          value={value}
          onKeyDown={onKeyDown}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search by seed phrase or private key hex..."
        />
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-black">About the Project</h2>
        <p>
          AdaKeys.com is an educational tool for exploring how Cardano wallet
          addresses are derived from entropy. It demonstrates how 12, 15, and
          24-word mnemonics (based on 128, 160, or 256-bit hex values) are used
          to generate both Icarus-style (Ae2td...) and Shelley-era (addr1...,
          stake1...) addresses following standard cryptographic derivation
          paths.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-black">Key Generation Process</h2>
        <p>
          Users provide raw entropy in hexadecimal format, which is converted
          into a BIP39 mnemonic phrase. This mnemonic is used to derive a
          Cardano root private key using industry-standard algorithms (Ed25519 +
          CIP-1852), and ultimately generate deterministic wallet addresses. All
          computations are performed locally in the browser.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-black"> Search Functionality</h2>
        <p>
          You can enter a hex string representing entropy to view the resulting
          mnemonic phrase, root keys, and derived addresses. The tool supports
          12-word (128-bit), 15-word (160-bit), and 24-word (256-bit) input
          lengths for demonstration purposes. It’s designed to help users
          understand how entropy flows through the derivation process to produce
          valid Cardano wallet addresses.
        </p>
      </section>
    </main>
  )
}
