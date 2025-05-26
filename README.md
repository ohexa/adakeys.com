Welcome to your new TanStack app!

# Getting Started

To run this application:

```bash
bun install
bunx --bun run start
```

# Building For Production

To build this application for production:

```bash
bunx --bun run build
```

## About the Project

**AdaKeys.com** is a comprehensive explorer of potential Cardano private keys. It focuses on both **Byron-era** (`ae2td...`) and **Shelley-era** (`addr1...`) address formats, built on the **Ed25519** curve. The platform provides a transparent view into the structure of private keys and how they correspond to valid Cardano addresses.

## Key Generation Process

Cardano private keys are 256-bit integers within a defined cryptographic range. Instead of storing keys in a database, **AdaKeys.com** generates them in real time based on page indices. Each page corresponds to a unique set of private keys and their associated public addresses.

## Search Functionality

Users can look up specific private keys using **hexadecimal**, **decimal**, or **raw binary** formats. This tool maps each key to its corresponding Cardano address and helps determine where any given key resides within the larger keyspace.

## Address Activity Monitoring

Each derived address is automatically checked for on-chain activity:

- **Green** highlights indicate addresses with a current balance.
- **Yellow** means the address had previous transactions but now holds no funds.
- **Gray** identifies addresses that have never been seen on the blockchain.

This visual system makes it easy to identify live or historical usage patterns across Cardano's public ledger.
