'use client'

import { useState, useMemo } from 'react'
import { Plus, Search, X } from 'lucide-react'
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

import {
  useCustomers,
  useCreateCustomer,
  useEditCustomer,
  useDeleteCustomer,
} from '@/hooks/use-customers'
import { CreateCustomer, GetCustomer } from '@/types/customer'

export default function Customers() {
  const { data: customers = [], isLoading } = useCustomers()
  console.log('customers data: ', customers)

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<GetCustomer | null>(
    null
  )
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)

  const [form, setForm] = useState<CreateCustomer>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: '',
    postalCode: '',
    country: 'Bangladesh',
    customerCode: '',
    note: '',
  })

  /* =========================
     FILTER
  ========================= */
  const filteredCustomers = useMemo(() => {
    const q = search.toLowerCase()
    return (customers ?? []).filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone ?? '').includes(q)
    )
  }, [customers, search])

  /* =========================
     PAGINATION
  ========================= */
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex)

  const handleItemsPerPageChange = (newItemsPerPage: number): void => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  /* =========================
     MUTATIONS
  ========================= */
  const createCustomerMutation = useCreateCustomer({
    onClose: () => setOpen(false),
    reset: () =>
      setForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        region: '',
        postalCode: '',
        country: 'Bangladesh',
        customerCode: '',
        note: '',
      }),
  })

  const editCustomerMutation = useEditCustomer({
    onClose: () => setOpen(false),
    reset: () =>
      setForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        region: '',
        postalCode: '',
        country: 'Bangladesh',
        customerCode: '',
        note: '',
      }),
  })

  const deleteCustomerMutation = useDeleteCustomer()

  /* =========================
     HANDLERS
  ========================= */
  const handleEdit = (customer: GetCustomer) => {
    setEditingCustomer(customer)
    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone ?? '',
      address: customer.address ?? '',
      city: customer.city ?? '',
      region: customer.region ?? '',
      postalCode: customer.postalCode ?? '',
      country: customer.country ?? 'Bangladesh',
      customerCode: customer.customerCode ?? '',
      note: customer.note ?? '',
    })
    setOpen(true)
  }

  const handleSave = () => {
    if (!form.name || !form.email) return

    if (editingCustomer) {
      editCustomerMutation.mutate({
        id: String(editingCustomer.customerId),
        data: form,
      })
    } else {
      createCustomerMutation.mutate(form)
    }

    setEditingCustomer(null)
  }

  const toggleSelectAll = () => {
    if (
      selectedCustomers.length === filteredCustomers.length &&
      filteredCustomers.length > 0
    ) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(filteredCustomers.map((c) => c.customerId))
    }
  }

  const toggleSelectCustomer = (id: number) => {
    setSelectedCustomers((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    )
  }

  const handleDelete = () => {
    selectedCustomers.forEach((id) => deleteCustomerMutation.mutate(String(id)))
    setSelectedCustomers([])
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="p-3 sm:p-6 space-y-4 mt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            onClick={() => setOpen(true)}
            className="bg-green-500 hover:bg-green-600 flex-1 sm:flex-none"
          >
            <Plus className="mr-2 h-4 w-4" />
            ADD CUSTOMER
          </Button>

          {selectedCustomers.length > 0 && (
            <Button variant="outline" onClick={handleDelete}>
              🗑 DELETE ({selectedCustomers.length})
            </Button>
          )}
        </div>

        {/* Search Bar */}
        {!showSearch ? (
          <button
            onClick={() => setShowSearch(true)}
            className="p-2.5 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors w-full sm:w-auto"
          >
            <Search size={18} className="text-gray-600 mx-auto" />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="px-3 py-2 pr-8 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-48"
                autoFocus
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              onClick={() => {
                setShowSearch(false)
                setSearch('')
              }}
              className="p-2.5 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors"
            >
              <X size={18} className="text-gray-600" />
            </button>
          </div>
        )}
      </div>

      {/* Table - Desktop */}
      <div className="hidden md:block rounded-md border bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedCustomers.length === filteredCustomers.length &&
                    filteredCustomers.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Contacts</TableHead>
              <TableHead>Total visits</TableHead>
              <TableHead>Total spent</TableHead>
              <TableHead>Points</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  Loading...
                </TableCell>
              </TableRow>
            ) : paginatedCustomers.length ? (
              paginatedCustomers.map((customer) => (
                <TableRow
                  key={customer.customerId}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleEdit(customer)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedCustomers.includes(customer.customerId)}
                      onCheckedChange={() =>
                        toggleSelectCustomer(customer.customerId)
                      }
                    />
                  </TableCell>

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

                  <TableCell>{customer.totalVisits ?? 0}</TableCell>
                  <TableCell>Tk{customer.totalSpent ?? '0.00'}</TableCell>
                  <TableCell>{customer.points ?? '0.00'}</TableCell>
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

      {/* Cards - Mobile */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : paginatedCustomers.length ? (
          paginatedCustomers.map((customer) => (
            <div
              key={customer.customerId}
              className="bg-white border rounded-lg p-4 space-y-3"
              onClick={() => handleEdit(customer)}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={selectedCustomers.includes(customer.customerId)}
                  onCheckedChange={() =>
                    toggleSelectCustomer(customer.customerId)
                  }
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-base">{customer.name}</div>
                  {customer.note && (
                    <div className="text-sm text-gray-500 mt-1">
                      {customer.note}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-medium">Email:</span>
                  <span className="truncate">{customer.email}</span>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="font-medium">Phone:</span>
                    <span>{customer.phone}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t text-sm">
                <div>
                  <div className="text-gray-500 text-xs">Visits</div>
                  <div className="font-medium">{customer.totalVisits ?? 0}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Spent</div>
                  <div className="font-medium">
                    Tk{customer.totalSpent ?? '0.00'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Points</div>
                  <div className="font-medium">{customer.points ?? '0.00'}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No customers found
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredCustomers.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 md:w-10 md:h-10 border rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-base"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 md:w-10 md:h-10 border rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-base"
            >
              ›
            </button>
          </div>

          {/* Page Info */}
          <div className="flex items-center gap-2">
            <span className="text-xs">Page:</span>
            <input
              type="number"
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value)
                if (page >= 1 && page <= totalPages) setCurrentPage(page)
              }}
              className="w-14 md:w-16 border rounded px-2 py-1 text-center text-xs"
              min={1}
              max={totalPages}
            />
            <span className="text-xs">of {totalPages}</span>
          </div>

          {/* Rows Per Page */}
          <div className="flex items-center gap-2">
            <span className="text-xs whitespace-nowrap">Rows per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="border rounded px-2 md:px-3 py-1 text-xs cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      )}

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center">
              {editingCustomer ? 'Edit Customer' : 'Add Customer'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div>
              <Label>Address</Label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            {/* City & Region */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>City</Label>
                <Input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div>
                <Label>Region</Label>
                <Input
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                />
              </div>
            </div>

            {/* Postal & Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Postal Code</Label>
                <Input
                  value={form.postalCode}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      postalCode: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Country</Label>
                <Select
                  value={form.country}
                  onValueChange={(value) =>
                    setForm({ ...form, country: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
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

            <div>
              <Label>Customer Code</Label>
              <Input
                value={form.customerCode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    customerCode: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Note</Label>
              <Textarea
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter className="mt-4 flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto"
            >
              CANCEL
            </Button>
            <Button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 w-full sm:w-auto"
            >
              SAVE
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
