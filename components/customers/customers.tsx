


'use client'

import { useState, useMemo } from 'react'
import { Plus, Search, Mail, Phone, MapPin, FileText } from 'lucide-react'
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

import { GetCustomer, CreateCustomer } from '@/types/items'

export default function Customers() {
  const { data: customers = [], isLoading } = useCustomers()

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [editingCustomer, setEditingCustomer] =
    useState<GetCustomer | null>(null)
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([])

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
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone ?? '').includes(q),
    )
  }, [customers, search])

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
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id],
    )
  }

  const handleDelete = () => {
    selectedCustomers.forEach((id) =>
      deleteCustomerMutation.mutate(String(id)),
    )
    setSelectedCustomers([])
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setOpen(true)}
            className="bg-green-500 hover:bg-green-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            ADD CUSTOMER
          </Button>

          {selectedCustomers.length > 0 && (
            <Button variant="outline" onClick={handleDelete}>
              🗑 DELETE
            </Button>
          )}
        </div>

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

      {/* Table */}
      <div className="rounded-md border bg-white">
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
            ) : filteredCustomers.length ? (
              filteredCustomers.map((customer) => (
                <TableRow
                  key={customer.customerId}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleEdit(customer)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedCustomers.includes(
                        customer.customerId,
                      )}
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
                  <TableCell>
                    Tk{customer.totalSpent ?? '0.00'}
                  </TableCell>
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

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center">
              {editingCustomer ? 'Edit Customer' : 'Add Customer'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <Label>Email</Label>
            <Input
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <Label>Phone</Label>
            <Input
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <Label>Address</Label>
            <Input
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />

            {/* City & Region */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>City</Label>
                <Input
                  value={form.city}
                  onChange={(e) =>
                    setForm({ ...form, city: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Region</Label>
                <Input
                  value={form.region}
                  onChange={(e) =>
                    setForm({ ...form, region: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Postal & Country */}
            <div className="grid grid-cols-2 gap-3">
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
                    <SelectItem value="Bangladesh">
                      Bangladesh
                    </SelectItem>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="Pakistan">
                      Pakistan
                    </SelectItem>
                    <SelectItem value="USA">USA</SelectItem>
                    <SelectItem value="UK">UK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

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

            <Label>Note</Label>
            <Textarea
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
