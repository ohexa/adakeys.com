import { Link, createFileRoute } from '@tanstack/react-router'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { zodValidator } from '@tanstack/zod-adapter'
import { ChevronDownIcon } from 'lucide-react'
import { useMemo } from 'react'

import type { AddressEntity } from '@/lib/address.entity'
import type { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { addressIcarus } from '@/lib/address.icarus'
import { addressShelley } from '@/lib/address.shelley'
import { keysSearch } from '@/lib/keys.search'

export const Route = createFileRoute('/keys')({
  component: RouteComponent,
  validateSearch: zodValidator(keysSearch),
})

function RouteComponent() {
  const pageSizeN = 20n
  const { style, hex, size } = Route.useSearch()

  const sizeToEntropyBits = {
    '12': 128n,
    '15': 160n,
    '24': 256n,
  } as const
  const entropyBits =
    sizeToEntropyBits[size as unknown as keyof typeof sizeToEntropyBits]

  const padLength = Number(entropyBits) / 4

  const hexStr = hex || '0'.repeat(padLength)
  const hexValue = BigInt(`0x${hexStr}`)

  const maxHexValue = (1n << entropyBits) - 1n
  const clampedHexValue = hexValue > maxHexValue ? maxHexValue : hexValue
  const toHexString = (val: bigint) => val.toString(16).padStart(padLength, '0')

  const nextHexValue = clampedHexValue + pageSizeN
  const prevHexValue =
    clampedHexValue >= pageSizeN ? clampedHexValue - pageSizeN : 0n
  const isMaxReached = nextHexValue > maxHexValue

  const totalPages = (maxHexValue + 1n + pageSizeN - 1n) / pageSizeN
  const lastPageStartValue = (totalPages - 1n) * pageSizeN
  const lastHex = toHexString(lastPageStartValue)

  const lastPageSize = Number(maxHexValue - lastPageStartValue + 1n)
  const isLastPage = clampedHexValue === lastPageStartValue
  const currentPageSize = isLastPage ? lastPageSize : Number(pageSizeN)

  const currentPage = clampedHexValue / pageSizeN + 1n

  const data: Array<AddressEntity> = useMemo(() => {
    return Array.from({ length: currentPageSize }, (_, i) => {
      const index = clampedHexValue + BigInt(i)
      const hexadecimal = index.toString(16).padStart(padLength, '0')

      const address =
        style === 'ae2td'
          ? addressIcarus(hexadecimal)
          : addressShelley(hexadecimal)

      return { hexadecimal, address } satisfies AddressEntity
    })
  }, [clampedHexValue, style, currentPageSize])

  const columns: Array<ColumnDef<AddressEntity>> = [
    { accessorKey: 'hexadecimal', header: 'Private Key' },
    { accessorKey: 'address', header: 'Address' },
  ]

  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: () => true },
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col justify-between items-center gap-4 sm:flex-row">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              Entropy Size: {size}
              <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Select entropy size</DropdownMenuLabel>
            {[12, 15, 24].map((n) => {
              const zeroHex = '0'.repeat(padLength)

              return (
                <DropdownMenuItem asChild key={n}>
                  <Link
                    to="/keys"
                    search={{
                      ...Route.useSearch(),
                      size: n,
                      hex: zeroHex,
                    }}
                  >
                    {n}
                  </Link>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex gap-2">
          <Link to="/keys" search={{ style, size, hex: toHexString(0n) }}>
            <Button disabled={clampedHexValue === 0n}>First</Button>
          </Link>

          <Link
            to="/keys"
            search={{ style, size, hex: toHexString(prevHexValue) }}
          >
            <Button disabled={clampedHexValue === 0n}>Previous</Button>
          </Link>

          <Link
            to="/keys"
            search={{ style, size, hex: toHexString(nextHexValue) }}
          >
            <Button disabled={isMaxReached}>Next</Button>
          </Link>

          <Link to="/keys" search={{ style, size, hex: lastHex }}>
            <Button disabled={clampedHexValue === lastPageStartValue}>
              Last
            </Button>
          </Link>
        </div>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center h-24">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="text-xs">
        {currentPage.toString()} of {totalPages.toString()}
      </div>
    </div>
  )
}
