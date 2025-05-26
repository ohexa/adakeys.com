import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <main className="flex flex-col gap-8">
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
      <section className="space-y-4">
        <h2 className="text-xl font-black">Address Activity Monitoring</h2>
        <p>
          Each generated address is automatically checked for activity on the
          Cardano blockchain:
        </p>
        <ul className="list-disc list-inside pl-4">
          <li>🟢 Green: Address currently holds a balance.</li>
          <li>
            🟡 Yellow: Address had transactions in the past but now has no
            funds.
          </li>
          <li>⚪ Gray: Address has never appeared on-chain.</li>
        </ul>
        <p>
          These visual indicators help illustrate which derived addresses have
          been used historically, providing insight into the network without
          compromising privacy or security.
        </p>
      </section>
    </main>
  )
}
