// import React from 'react'

// const Customers = () => {
//   return (
//     <div>
//         all customers details are show here
//     </div>
//   )
// }

// export default Customers

'use client'

import { useState } from 'react'
import { Plus, Search } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type Customer = {
  id: number
  name: string
  email: string
  phone: string
  note: string
  totalVisits: number
  totalSpent: number
  points: number
}

export default function Customers() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 1,
      name: 'Rifatul Islam Riad',
      email: 'rifat.islam.cse@gmail.com',
      phone: '01876980021',
      note: 'this is testing notes',
      totalVisits: 0,
      totalSpent: 0,
      points: 0,
    },
  ])

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: '',
    postalCode: '',
    country: '',
    note: '',
  })

  // 🔍 Search filter
  const filteredCustomers = customers.filter((customer) => {
    const q = search.toLowerCase()
    return (
      customer.name.toLowerCase().includes(q) ||
      customer.email.toLowerCase().includes(q) ||
      customer.phone.includes(q)
    )
  })

  const handleSave = () => {
    if (!form.name || !form.email) return

    setCustomers((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: form.name,
        email: form.email,
        phone: form.phone,
        note: form.note,
        totalVisits: 0,
        totalSpent: 0,
        points: 0,
      },
    ])

    setForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      region: '',
      postalCode: '',
      country: '',
      note: '',
    })

    setOpen(false)
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => setOpen(true)}
          className="bg-green-500 hover:bg-green-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          ADD CUSTOMER
        </Button>

        {/* Search bar */}
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customer..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contacts</TableHead>
              <TableHead>Total visits</TableHead>
              <TableHead>Total spent</TableHead>
              <TableHead>Points balance</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="font-semibold">{customer.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {customer.note}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div>{customer.email}</div>
                    <div className="text-sm text-muted-foreground">
                      {customer.phone}
                    </div>
                  </TableCell>

                  <TableCell>{customer.totalVisits}</TableCell>
                  <TableCell>Tk{customer.totalSpent}.00</TableCell>
                  <TableCell>{customer.points.toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No customers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Customer Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-center">
              Add Customer
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
            <Input
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
            <Input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
            <Input
              placeholder="Address"
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="City"
                value={form.city}
                onChange={(e) =>
                  setForm({ ...form, city: e.target.value })
                }
              />
              <Input
                placeholder="Region"
                value={form.region}
                onChange={(e) =>
                  setForm({ ...form, region: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Postal code"
                value={form.postalCode}
                onChange={(e) =>
                  setForm({ ...form, postalCode: e.target.value })
                }
              />
              <Input
                placeholder="Country"
                value={form.country}
                onChange={(e) =>
                  setForm({ ...form, country: e.target.value })
                }
              />
            </div>

            <Textarea
              placeholder="Note"
              maxLength={255}
              value={form.note}
              onChange={(e) =>
                setForm({ ...form, note: e.target.value })
              }
            />
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              CANCEL
            </Button>
            <Button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600"
            >
              SAVE
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
