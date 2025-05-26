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
import type { EntropySize } from '@/lib/entropy.size'
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
import { entropyMap } from '@/lib/entropy.map'
import { keysSearch } from '@/lib/keys.search'

export const Route = createFileRoute('/keys')({
  component: RouteComponent,
  validateSearch: zodValidator(keysSearch),
})

function RouteComponent() {
  const pageSizeN = 20n

  const { style, page, entropySize } = Route.useSearch()

  const pageN = BigInt(page)

  const data: Array<AddressEntity> = useMemo(() => {
    const bits = entropyMap.get(BigInt(entropySize) as EntropySize)
    const start = (pageN - 1n) * pageSizeN
    const length = Number(bits) / 4

    return Array.from({ length: Number(pageSizeN) }, (_, i) => {
      const index = start + BigInt(i)
      const hexadecimal = index.toString(16).padStart(length, '0')

      let address: string

      switch (style) {
        case 'ae2td':
          address = addressIcarus(hexadecimal)
          break
        case 'addr1':
          address = addressShelley(hexadecimal)
          break
      }

      return {
        hexadecimal,
        address,
      } satisfies AddressEntity
    })
  }, [page, entropySize, style])

  const columns: Array<ColumnDef<AddressEntity>> = [
    {
      accessorKey: 'hexadecimal',
      header: 'Private Key',
    },
    {
      accessorKey: 'address',
      header: 'Address',
    },
  ]

  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: () => true },
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              Entropy Size: {entropySize}
              <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Select entropy size</DropdownMenuLabel>
            {[12, 15, 24].map((n: number) => (
              <DropdownMenuItem asChild>
                <Link
                  to={'/keys'}
                  search={{
                    ...Route.useSearch(),
                    entropySize: n,
                  }}
                >
                  {n}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Button disabled={pageN === 1n}>
            <Link
              to={'/keys'}
              search={{
                ...Route.useSearch(),
                page: Number(pageN - 1n),
              }}
            >
              Previous
            </Link>
          </Button>
          <Button>
            <Link
              to={'/keys'}
              search={{
                ...Route.useSearch(),
                page: Number(pageN + 1n),
              }}
            >
              Next
            </Link>
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
