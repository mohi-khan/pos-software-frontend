

"use client"

import { useState } from "react"
import { Plus, Search, Mail, Phone, MapPin, FileText } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

type Customer = {
  id: number
  name: string
  email: string
  phone: string
  address: string
  city: string
  region: string
  postalCode: string
  country: string
  customerCode: string
  note: string
  totalVisits: number
  totalSpent: number
  points: number
}

export default function Customers() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([])

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 1,
      name: "Rifatul Islam Riad",
      email: "rifat.islam.cse@gmail.com",
      phone: "01876980021",
      address: "chawkh bazar",
      city: "chittagong",
      region: "Islam",
      postalCode: "4000",
      country: "Bangladesh",
      customerCode: "riad007",
      note: "this is testing notes",
      totalVisits: 0,
      totalSpent: 0,
      points: 0,
    },
  ])

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    region: "",
    postalCode: "",
    country: "Bangladesh",
    customerCode: "",
    note: "",
  })

  const filteredCustomers = customers.filter((customer) => {
    const q = search.toLowerCase()
    return (
      customer.name.toLowerCase().includes(q) || customer.email.toLowerCase().includes(q) || customer.phone.includes(q)
    )
  })

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      region: customer.region,
      postalCode: customer.postalCode,
      country: customer.country,
      customerCode: customer.customerCode,
      note: customer.note,
    })
    setOpen(true)
  }

  const handleSave = () => {
    if (!form.name || !form.email) return

    if (editingCustomer) {
      // Update existing customer
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingCustomer.id
            ? {
                ...c,
                name: form.name,
                email: form.email,
                phone: form.phone,
                address: form.address,
                city: form.city,
                region: form.region,
                postalCode: form.postalCode,
                country: form.country,
                customerCode: form.customerCode,
                note: form.note,
              }
            : c,
        ),
      )
    } else {
      // Add new customer
      setCustomers((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          region: form.region,
          postalCode: form.postalCode,
          country: form.country,
          customerCode: form.customerCode,
          note: form.note,
          totalVisits: 0,
          totalSpent: 0,
          points: 0,
        },
      ])
    }

    // Reset form
    setForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      region: "",
      postalCode: "",
      country: "Bangladesh",
      customerCode: "",
      note: "",
    })

    setEditingCustomer(null)
    setOpen(false)
  }

  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      setEditingCustomer(null)
      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        region: "",
        postalCode: "",
        country: "Bangladesh",
        customerCode: "",
        note: "",
      })
    }
    setOpen(isOpen)
  }

  const toggleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(filteredCustomers.map((c) => c.id))
    }
  }

  const toggleSelectCustomer = (id: number) => {
    setSelectedCustomers((prev) => (prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]))
  }

  const handleDelete = () => {
    setCustomers((prev) => prev.filter((c) => !selectedCustomers.includes(c.id)))
    setSelectedCustomers([])
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button onClick={() => setOpen(true)} className="bg-green-500 hover:bg-green-600">
            <Plus className="mr-2 h-4 w-4" />
            ADD CUSTOMER
          </Button>

          {selectedCustomers.length > 0 && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 text-gray-700 border border-gray-300 px-4 py-2 rounded"
            >
              <span className="text-xl">🗑</span>
              <span className="font-medium">DELETE</span>
            </button>
          )}
        </div>

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
              {/* Checkbox column header */}
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
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
                <TableRow
                  key={customer.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest("button")) return
                    handleEdit(customer)
                  }}
                >
                  {/* Checkbox cell for individual selection */}
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedCustomers.includes(customer.id)}
                      onCheckedChange={() => toggleSelectCustomer(customer.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">{customer.name}</div>
                    <div className="text-sm text-muted-foreground">{customer.note}</div>
                  </TableCell>

                  <TableCell>
                    <div>{customer.email}</div>
                    <div className="text-sm text-muted-foreground">{customer.phone}</div>
                  </TableCell>

                  <TableCell>{customer.totalVisits}</TableCell>
                  <TableCell>Tk{customer.totalSpent}.00</TableCell>
                  <TableCell>{customer.points.toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No customers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Customer Dialog */}
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center">{editingCustomer ? "Edit Customer" : "Add Customer"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-blue-300 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white mb-2" />
                <div className="w-12 h-8 rounded-t-full bg-white absolute mt-10" />
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Name</Label>
              <Input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Email"
                  className="pl-9"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Phone"
                  className="pl-9"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Address"
                  className="pl-9"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
            </div>

            {/* City and Region */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">City</Label>
                <Input
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Region</Label>
                <Input
                  placeholder="Region"
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                />
              </div>
            </div>

            {/* Postal Code and Country */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Postal code</Label>
                <Input
                  placeholder="Postal code"
                  value={form.postalCode}
                  onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Country</Label>
                <Select value={form.country} onValueChange={(value) => setForm({ ...form, country: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="Pakistan">Pakistan</SelectItem>
                    <SelectItem value="USA">USA</SelectItem>
                    <SelectItem value="UK">UK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Customer code</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Customer code"
                  className="pl-9"
                  value={form.customerCode}
                  onChange={(e) => setForm({ ...form, customerCode: e.target.value })}
                />
              </div>
            </div>

            {/* Note with character counter */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Note</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Textarea
                  placeholder="Note"
                  maxLength={255}
                  className="pl-9 min-h-[60px]"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
                <div className="text-xs text-muted-foreground text-right mt-1">{form.note.length} / 255</div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => handleDialogClose(false)}>
              CANCEL
            </Button>
            <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
              SAVE
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
