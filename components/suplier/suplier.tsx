'use client'

import { useState } from 'react'
import {
  Plus,
  Search,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
  Truck,
} from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

type Supplier = {
  id: number
  name: string
  contact: string
  email: string
  phone: string
  website: string
  address1: string
  address2: string
  city: string
  region: string
  postalCode: string
  country: string
  note: string
}

export default function Suppliers() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: 1,
      name: 'riad',
      contact: '01876980021',
      email: 'riadchy37@gmail.com',
      phone: '01876980021',
      website: 'nul',
      address1: 'sfgsf',
      address2: 'fajfaj',
      city: 'ffsifj',
      region: 'sfjsfij',
      postalCode: 'ase3224',
      country: 'Bangladesh',
      note: 'asdas',
    },
  ])

  const [form, setForm] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    website: '',
    address1: '',
    address2: '',
    city: '',
    region: '',
    postalCode: '',
    country: 'Bangladesh',
    note: '',
  })

  const filteredSuppliers = suppliers.filter((supplier) => {
    const q = search.toLowerCase()
    return (
      supplier.name.toLowerCase().includes(q) ||
      supplier.contact.toLowerCase().includes(q) ||
      supplier.email.toLowerCase().includes(q) ||
      supplier.phone.includes(q)
    )
  })

  const totalPages = Math.ceil(filteredSuppliers.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedSuppliers = filteredSuppliers.slice(
    startIndex,
    startIndex + rowsPerPage
  )

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setForm({
      name: supplier.name,
      contact: supplier.contact,
      email: supplier.email,
      phone: supplier.phone,
      website: supplier.website,
      address1: supplier.address1,
      address2: supplier.address2,
      city: supplier.city,
      region: supplier.region,
      postalCode: supplier.postalCode,
      country: supplier.country,
      note: supplier.note,
    })
    setOpen(true)
  }

  const handleSave = () => {
    if (!form.name) return

    if (editingSupplier) {
      // Update existing supplier
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === editingSupplier.id
            ? {
                ...s,
                name: form.name,
                contact: form.contact,
                email: form.email,
                phone: form.phone,
                website: form.website,
                address1: form.address1,
                address2: form.address2,
                city: form.city,
                region: form.region,
                postalCode: form.postalCode,
                country: form.country,
                note: form.note,
              }
            : s
        )
      )
    } else {
      // Add new supplier
      setSuppliers((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          name: form.name,
          contact: form.contact,
          email: form.email,
          phone: form.phone,
          website: form.website,
          address1: form.address1,
          address2: form.address2,
          city: form.city,
          region: form.region,
          postalCode: form.postalCode,
          country: form.country,
          note: form.note,
        },
      ])
    }

    // Reset form
    setForm({
      name: '',
      contact: '',
      email: '',
      phone: '',
      website: '',
      address1: '',
      address2: '',
      city: '',
      region: '',
      postalCode: '',
      country: 'Bangladesh',
      note: '',
    })

    setEditingSupplier(null)
    setOpen(false)
  }

  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      setEditingSupplier(null)
      setForm({
        name: '',
        contact: '',
        email: '',
        phone: '',
        website: '',
        address1: '',
        address2: '',
        city: '',
        region: '',
        postalCode: '',
        country: 'Bangladesh',
        note: '',
      })
    }
    setOpen(isOpen)
  }

  const toggleSelectAll = () => {
    if (
      selectedSuppliers.length === paginatedSuppliers.length &&
      paginatedSuppliers.length > 0
    ) {
      setSelectedSuppliers([])
    } else {
      setSelectedSuppliers(paginatedSuppliers.map((s) => s.id))
    }
  }

  const toggleSelectSupplier = (id: number) => {
    setSelectedSuppliers((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    )
  }

  const handleDelete = () => {
    setSuppliers((prev) =>
      prev.filter((s) => !selectedSuppliers.includes(s.id))
    )
    setSelectedSuppliers([])
  }

  return (
    <div className="p-6 space-y-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold"
          >
            <Plus className="mr-2 h-4 w-4" />
            ADD SUPPLIER
          </Button>

          {selectedSuppliers.length > 0 && (
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
          <Input
            placeholder="Search suppliers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10"
          />
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 cursor-pointer" />
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedSuppliers.length === paginatedSuppliers.length &&
                    paginatedSuppliers.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="text-gray-600 font-semibold">
                Name
              </TableHead>
              <TableHead className="text-gray-600 font-semibold">
                Contact
              </TableHead>
              <TableHead className="text-gray-600 font-semibold">
                Phone number
              </TableHead>
              <TableHead className="text-gray-600 font-semibold">
                Email
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedSuppliers.length > 0 ? (
              paginatedSuppliers.map((supplier) => (
                <TableRow
                  key={supplier.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('button')) return
                    handleEdit(supplier)
                  }}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedSuppliers.includes(supplier.id)}
                      onCheckedChange={() => toggleSelectSupplier(supplier.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.contact}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-gray-500"
                >
                  No suppliers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="flex items-center gap-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10"
            >
              &lt;
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="w-10 h-10"
            >
              &gt;
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Page:</span>
            <Input
              type="number"
              value={currentPage}
              onChange={(e) => {
                const page = Number.parseInt(e.target.value)
                if (page >= 1 && page <= totalPages) {
                  setCurrentPage(page)
                }
              }}
              className="w-16 h-9 text-center"
              min={1}
              max={totalPages}
            />
            <span className="text-sm text-gray-600">of {totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={(value) => setRowsPerPage(Number.parseInt(value))}
            >
              <SelectTrigger className="w-20 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Add/Edit Supplier Dialog */}
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[400px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">
              {editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
            </DialogTitle>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center">
                <Truck className="h-10 w-10 text-white" />
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* Supplier name */}
            <div className="space-y-2">
              <Label className="text-gray-500 text-xs">
                {editingSupplier ? 'Supplier name' : 'Supplier name'}
              </Label>
              <Input
                placeholder="Supplier name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border-gray-300"
              />
            </div>

            {/* Contact */}
            <div className="space-y-2">
              <Label className="text-gray-500 text-xs">Contact</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Contact"
                  className="pl-9 border-gray-300"
                  value={form.contact}
                  onChange={(e) =>
                    setForm({ ...form, contact: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-gray-500 text-xs">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Email"
                  className="pl-9 border-gray-300"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label className="text-gray-500 text-xs">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Phone"
                  className="pl-9 border-gray-300"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label className="text-gray-500 text-xs">Website</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Website"
                  className="pl-9 border-gray-300"
                  value={form.website}
                  onChange={(e) =>
                    setForm({ ...form, website: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Address 1 */}
            <div className="space-y-2">
              <Label className="text-gray-500 text-xs">Address 1</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Address 1"
                  className="pl-9 border-gray-300"
                  value={form.address1}
                  onChange={(e) =>
                    setForm({ ...form, address1: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Address 2 */}
            <div className="space-y-2">
              <Label className="text-gray-500 text-xs">Address 2</Label>
              <Input
                placeholder="Address 2"
                className="border-gray-300"
                value={form.address2}
                onChange={(e) => setForm({ ...form, address2: e.target.value })}
              />
            </div>

            {/* City and Region */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-gray-500 text-xs">City</Label>
                <Input
                  placeholder="City"
                  className="border-gray-300"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-500 text-xs">Region</Label>
                <Input
                  placeholder="Region"
                  className="border-gray-300"
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                />
              </div>
            </div>

            {/* Postal Code and Country */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-gray-500 text-xs">Postal code</Label>
                <Input
                  placeholder="Postal code"
                  className="border-gray-300"
                  value={form.postalCode}
                  onChange={(e) =>
                    setForm({ ...form, postalCode: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-500 text-xs">Country</Label>
                <Select
                  value={form.country}
                  onValueChange={(value) =>
                    setForm({ ...form, country: value })
                  }
                >
                  <SelectTrigger className="border-gray-300">
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

            {/* Note with character counter */}
            <div className="space-y-2">
              <Label className="text-gray-500 text-xs">Note</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Textarea
                  placeholder="Note"
                  maxLength={500}
                  className="pl-9 min-h-[60px] border-gray-300"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
                <div className="text-xs text-gray-400 text-right mt-1">
                  {form.note.length} / 500
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="ghost"
              onClick={() => handleDialogClose(false)}
              className="text-gray-600"
            >
              CANCEL
            </Button>
            <Button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              SAVE
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
