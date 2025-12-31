// 'use client'

// import { useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Textarea } from '@/components/ui/textarea'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog'
// import { Checkbox } from '@/components/ui/checkbox'
// import { Plus, Search, Trash2, ArrowLeft, FileDown, X } from 'lucide-react'

// type PurchaseOrderStatus = 'Draft' | 'Pending' | 'Partially received' | 'Closed'

// type Item = {
//   id: string
//   name: string
//   sku: string
//   inStock: number
//   incoming: number
//   quantity: number
//   purchaseCost: number
//   amount: number
// }

// type AdditionalCost = {
//   id: string
//   name: string
//   amount: number
// }

// type PurchaseOrder = {
//   id: string
//   orderNumber: string
//   date: string
//   expectedDate: string
//   orderedBy: string
//   supplier: string
//   supplierEmail: string
//   supplierPhone: string
//   destinationStore: string
//   status: PurchaseOrderStatus
//   received: string
//   notes: string
//   items: Item[]
//   additionalCosts: AdditionalCost[]
// }

// type ReceiveItem = {
//   itemId: string
//   toReceive: number
// }

// type View = 'list' | 'detail'

// const mockPurchaseOrders: PurchaseOrder[] = [
//   {
//     id: '1',
//     orderNumber: 'PO1001',
//     date: 'Dec 17, 2025',
//     expectedDate: 'Dec 18, 2025',
//     orderedBy: 'Owner',
//     supplier: 'riad',
//     supplierEmail: 'riaodiy37@gmail.com',
//     supplierPhone: '01876980021',
//     destinationStore: 'new business',
//     status: 'Pending',
//     received: '0 of 3',
//     notes: 'test note',
//     items: [
//       {
//         id: '1',
//         name: 'new item (medium / large)',
//         sku: '10000',
//         inStock: 1200,
//         incoming: 0,
//         quantity: 1,
//         purchaseCost: 10.0,
//         amount: 10.0,
//       },
//       {
//         id: '2',
//         name: 'new items 2 (xxl)',
//         sku: '10001',
//         inStock: 0,
//         incoming: 0,
//         quantity: 2,
//         purchaseCost: 1200.0,
//         amount: 2400.0,
//       },
//     ],
//     additionalCosts: [
//       { id: '1', name: 'new cost', amount: 450.0 },
//       { id: '2', name: 'cost 2', amount: 250.0 },
//     ],
//   },
// ]

// const PurchaseOrders = () => {
//   const [view, setView] = useState<View>('list')
//   const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null)
//   const [purchaseOrders, setPurchaseOrders] =
//     useState<PurchaseOrder[]>(mockPurchaseOrders)
//   const [statusFilter, setStatusFilter] = useState<string>('All')
//   const [supplierFilter, setSupplierFilter] = useState<string>('All suppliers')
//   const [searchQuery, setSearchQuery] = useState('')
//  const [showSearch, setShowSearch] = useState(false)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
//   const [isReceiveDialogOpen, setIsReceiveDialogOpen] = useState(false)
//   const [receiveItems, setReceiveItems] = useState<ReceiveItem[]>([])
//   const [selectedAdditionalCosts, setSelectedAdditionalCosts] = useState<
//     string[]
//   >([])

//   const [formData, setFormData] = useState<Partial<PurchaseOrder>>({
//     supplier: '',
//     date: '',
//     expectedDate: '',
//     notes: '',
//     items: [],
//     additionalCosts: [],
//   })

//   const handleRowClick = (order: PurchaseOrder) => {
//     setSelectedOrder(order)
//     setView('detail')
//   }

//   const handleCreateNew = () => {
//     setFormData({
//       supplier: '',
//       date: new Date().toISOString().split('T')[0],
//       expectedDate: '',
//       notes: '',
//       items: [],
//       additionalCosts: [],
//     })
//     setIsCreateDialogOpen(true)
//   }

//   const handleEdit = () => {
//     if (selectedOrder) {
//       setFormData(selectedOrder)
//       setIsEditDialogOpen(true)
//     }
//   }

//   const handleBack = () => {
//     setView('list')
//     setSelectedOrder(null)
//   }

//   const handleAddItem = () => {
//     const newItem: Item = {
//       id: Date.now().toString(),
//       name: '',
//       sku: '',
//       inStock: 0,
//       incoming: 0,
//       quantity: 0,
//       purchaseCost: 0,
//       amount: 0,
//     }
//     setFormData({
//       ...formData,
//       items: [...(formData.items || []), newItem],
//     })
//   }

//   const handleRemoveItem = (itemId: string) => {
//     setFormData({
//       ...formData,
//       items: formData.items?.filter((item) => item.id !== itemId),
//     })
//   }

//   const handleItemChange = (itemId: string, field: keyof Item, value: any) => {
//     const updatedItems = formData.items?.map((item) => {
//       if (item.id === itemId) {
//         const updatedItem = { ...item, [field]: value }
//         if (field === 'quantity' || field === 'purchaseCost') {
//           updatedItem.amount = updatedItem.quantity * updatedItem.purchaseCost
//         }
//         return updatedItem
//       }
//       return item
//     })
//     setFormData({ ...formData, items: updatedItems })
//   }

//   const handleAddAdditionalCost = () => {
//     const newCost: AdditionalCost = {
//       id: Date.now().toString(),
//       name: '',
//       amount: 0,
//     }
//     setFormData({
//       ...formData,
//       additionalCosts: [...(formData.additionalCosts || []), newCost],
//     })
//   }

//   const handleRemoveAdditionalCost = (costId: string) => {
//     setFormData({
//       ...formData,
//       additionalCosts: formData.additionalCosts?.filter(
//         (cost) => cost.id !== costId
//       ),
//     })
//   }

//   const handleAdditionalCostChange = (
//     costId: string,
//     field: keyof AdditionalCost,
//     value: any
//   ) => {
//     const updatedCosts = formData.additionalCosts?.map((cost) =>
//       cost.id === costId ? { ...cost, [field]: value } : cost
//     )
//     setFormData({ ...formData, additionalCosts: updatedCosts })
//   }

//   const calculateTotal = () => {
//     const itemsTotal =
//       formData.items?.reduce((sum, item) => sum + item.amount, 0) || 0
//     const costsTotal =
//       formData.additionalCosts?.reduce((sum, cost) => sum + cost.amount, 0) || 0
//     return itemsTotal + costsTotal
//   }

//   const handleSave = () => {
//     if (isCreateDialogOpen) {
//       const newOrder: PurchaseOrder = {
//         id: Date.now().toString(),
//         orderNumber: `PO${1001 + purchaseOrders.length}`,
//         orderedBy: 'Owner',
//         status: 'Pending',
//         received: `0 of ${formData.items?.length || 0}`,
//         supplierEmail: '',
//         supplierPhone: '',
//         destinationStore: 'new business',
//         ...formData,
//       } as PurchaseOrder
//       setPurchaseOrders([...purchaseOrders, newOrder])
//       setIsCreateDialogOpen(false)
//     } else if (isEditDialogOpen && selectedOrder) {
//       const updatedOrders = purchaseOrders.map((order) =>
//         order.id === selectedOrder.id ? { ...order, ...formData } : order
//       )
//       setPurchaseOrders(updatedOrders)
//       setSelectedOrder({ ...selectedOrder, ...formData } as PurchaseOrder)
//       setIsEditDialogOpen(false)
//     }
//   }

//   const handleSaveAsDraft = () => {
//     const newOrder: PurchaseOrder = {
//       id: Date.now().toString(),
//       orderNumber: `PO${1001 + purchaseOrders.length}`,
//       orderedBy: 'Owner',
//       status: 'Draft',
//       received: `0 of ${formData.items?.length || 0}`,
//       supplierEmail: '',
//       supplierPhone: '',
//       destinationStore: 'new business',
//       ...formData,
//     } as PurchaseOrder
//     setPurchaseOrders([...purchaseOrders, newOrder])
//     setIsCreateDialogOpen(false)
//   }

//   const handleExportToCSV = () => {
//     if (!selectedOrder) return

//     const total =
//       selectedOrder.items.reduce((sum, item) => sum + item.amount, 0) +
//       selectedOrder.additionalCosts.reduce((sum, cost) => sum + cost.amount, 0)

//     let csv = 'Purchase Order Details\n\n'
//     csv += `Order Number:,${selectedOrder.orderNumber}\n`
//     csv += `Status:,${selectedOrder.status}\n`
//     csv += `Date:,${selectedOrder.date}\n`
//     csv += `Expected Date:,${selectedOrder.expectedDate}\n`
//     csv += `Ordered By:,${selectedOrder.orderedBy}\n`
//     csv += `Supplier:,${selectedOrder.supplier}\n`
//     csv += `Destination Store:,${selectedOrder.destinationStore}\n`
//     csv += `Notes:,${selectedOrder.notes}\n\n`

//     csv += 'Items\n'
//     csv += 'Item,SKU,Quantity,Purchase Cost,Amount\n'
//     selectedOrder.items.forEach((item) => {
//       csv += `"${item.name}",${item.sku},${item.quantity},Tk${item.purchaseCost.toFixed(2)},Tk${item.amount.toFixed(2)}\n`
//     })

//     csv += '\nAdditional Costs\n'
//     csv += 'Name,Amount\n'
//     selectedOrder.additionalCosts.forEach((cost) => {
//       csv += `${cost.name},Tk${cost.amount.toFixed(2)}\n`
//     })

//     csv += `\nTotal:,Tk${total.toFixed(2)}\n`

//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
//     const link = document.createElement('a')
//     const url = URL.createObjectURL(blob)
//     link.setAttribute('href', url)
//     link.setAttribute('download', `${selectedOrder.orderNumber}_export.csv`)
//     link.style.visibility = 'hidden'
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//   }

//   const handleReceive = () => {
//     if (selectedOrder) {
//       const items = selectedOrder.items.map((item) => ({
//         itemId: item.id,
//         toReceive: 0,
//       }))
//       setReceiveItems(items)
//       setSelectedAdditionalCosts([])
//       setIsReceiveDialogOpen(true)
//     }
//   }

//   const handleMarkAllReceived = () => {
//     if (selectedOrder) {
//       const items = selectedOrder.items.map((item) => ({
//         itemId: item.id,
//         toReceive: item.quantity, // Set to the full ordered quantity
//       }))
//       setReceiveItems(items)

//       if (selectedOrder.additionalCosts) {
//         const allCostIds = selectedOrder.additionalCosts.map((cost) => cost.id)
//         setSelectedAdditionalCosts(allCostIds)
//       }
//     }
//   }

//   const handleReceiveQuantityChange = (itemId: string, value: string) => {
//     const numValue = Number.parseInt(value) || 0
//     setReceiveItems((prev) =>
//       prev.map((item) =>
//         item.itemId === itemId ? { ...item, toReceive: numValue } : item
//       )
//     )
//   }

//   const handleToggleAdditionalCost = (costId: string) => {
//     setSelectedAdditionalCosts((prev) =>
//       prev.includes(costId)
//         ? prev.filter((id) => id !== costId)
//         : [...prev, costId]
//     )
//   }

//   const handleConfirmReceive = () => {
//     if (!selectedOrder) return

//     const totalReceived = receiveItems.reduce(
//       (sum, item) => sum + item.toReceive,
//       0
//     )
//     const totalOrdered = selectedOrder.items.reduce(
//       (sum, item) => sum + item.quantity,
//       0
//     )

//     const updatedOrder = {
//       ...selectedOrder,
//       received: `${totalReceived} of ${totalOrdered}`,
//       status: (totalReceived >= totalOrdered
//         ? 'Closed'
//         : 'Partially received') as PurchaseOrderStatus,
//     }

//     setPurchaseOrders((prev) =>
//       prev.map((order) =>
//         order.id === selectedOrder.id ? updatedOrder : order
//       )
//     )
//     setSelectedOrder(updatedOrder)
//     setIsReceiveDialogOpen(false)
//   }

//   const filteredOrders = purchaseOrders.filter((order) => {
//     const matchesStatus =
//       statusFilter === 'All' || order.status === statusFilter
//     const matchesSupplier =
//       supplierFilter === 'All suppliers' || order.supplier === supplierFilter
//     const matchesSearch =
//       searchQuery === '' ||
//       order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       order.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       order.destinationStore.toLowerCase().includes(searchQuery.toLowerCase())
//     return matchesStatus && matchesSupplier && matchesSearch
//   })

//   const renderForm = (isEdit: boolean) => {
//     const total = calculateTotal()

//     return (
//       <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
//         <div>
//           <Label htmlFor="supplier">Supplier</Label>
//           <Input
//             id="supplier"
//             value={formData.supplier}
//             onChange={(e) =>
//               setFormData({ ...formData, supplier: e.target.value })
//             }
//             placeholder="Enter supplier name"
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <Label htmlFor="date">Purchase order date</Label>
//             <Input
//               id="date"
//               type="date"
//               value={formData.date}
//               onChange={(e) =>
//                 setFormData({ ...formData, date: e.target.value })
//               }
//             />
//           </div>

//           <div>
//             <Label htmlFor="expectedDate">Expected on</Label>
//             <Input
//               id="expectedDate"
//               type="date"
//               value={formData.expectedDate}
//               onChange={(e) =>
//                 setFormData({ ...formData, expectedDate: e.target.value })
//               }
//             />
//           </div>
//         </div>

//         <div>
//           <Label htmlFor="notes">Notes</Label>
//           <Textarea
//             id="notes"
//             value={formData.notes}
//             onChange={(e) =>
//               setFormData({ ...formData, notes: e.target.value })
//             }
//             placeholder="Add notes..."
//             className="min-h-[80px]"
//           />
//           <p className="text-xs text-muted-foreground mt-1">
//             {formData.notes?.length || 0} / 500
//           </p>
//         </div>

//         <div>
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="font-medium">Items</h3>
//             <div className="flex gap-2">
//               <Button variant="outline" size="sm">
//                 IMPORT
//               </Button>
//               {!isEdit && (
//                 <Button variant="outline" size="sm">
//                   AUTOFILL
//                 </Button>
//               )}
//             </div>
//           </div>

//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Item</TableHead>
//                 <TableHead className="text-right">In stock</TableHead>
//                 <TableHead className="text-right">Incoming</TableHead>
//                 <TableHead className="text-right">Quantity</TableHead>
//                 <TableHead className="text-right">Purchase cost</TableHead>
//                 <TableHead className="text-right">Amount</TableHead>
//                 <TableHead></TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {formData.items?.map((item) => (
//                 <TableRow key={item.id}>
//                   <TableCell>
//                     <Input
//                       value={item.name}
//                       onChange={(e) =>
//                         handleItemChange(item.id, 'name', e.target.value)
//                       }
//                       placeholder="Item name"
//                       className="min-w-[200px]"
//                     />
//                     <Input
//                       value={item.sku}
//                       onChange={(e) =>
//                         handleItemChange(item.id, 'sku', e.target.value)
//                       }
//                       placeholder="SKU"
//                       className="mt-1 text-sm"
//                     />
//                   </TableCell>
//                   <TableCell className="text-right">{item.inStock}</TableCell>
//                   <TableCell className="text-right">{item.incoming}</TableCell>
//                   <TableCell>
//                     <Input
//                       type="number"
//                       value={item.quantity}
//                       onChange={(e) =>
//                         handleItemChange(
//                           item.id,
//                           'quantity',
//                           Number(e.target.value)
//                         )
//                       }
//                       className="w-20 text-right"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Input
//                       type="number"
//                       value={item.purchaseCost}
//                       onChange={(e) =>
//                         handleItemChange(
//                           item.id,
//                           'purchaseCost',
//                           Number(e.target.value)
//                         )
//                       }
//                       className="w-24 text-right"
//                     />
//                   </TableCell>
//                   <TableCell className="text-right">
//                     Tk{item.amount.toFixed(2)}
//                   </TableCell>
//                   <TableCell>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => handleRemoveItem(item.id)}
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>

//           <Button variant="link" onClick={handleAddItem} className="mt-2">
//             Search item
//           </Button>
//         </div>

//         <div>
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="font-medium">Additional cost</h3>
//             <span className="font-medium">Amount</span>
//           </div>

//           <div className="space-y-2">
//             {formData.additionalCosts?.map((cost) => (
//               <div key={cost.id} className="flex items-center gap-2">
//                 <Input
//                   value={cost.name}
//                   onChange={(e) =>
//                     handleAdditionalCostChange(cost.id, 'name', e.target.value)
//                   }
//                   placeholder="Cost name"
//                   className="flex-1"
//                 />
//                 <Input
//                   type="number"
//                   value={cost.amount}
//                   onChange={(e) =>
//                     handleAdditionalCostChange(
//                       cost.id,
//                       'amount',
//                       Number(e.target.value)
//                     )
//                   }
//                   className="w-32 text-right"
//                 />
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => handleRemoveAdditionalCost(cost.id)}
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             ))}
//           </div>

//           <Button
//             variant="link"
//             onClick={handleAddAdditionalCost}
//             className="mt-2"
//           >
//             <Plus className="h-4 w-4 mr-1" />
//             ADD ADDITIONAL COST
//           </Button>
//         </div>

//         <div className="flex items-center justify-between pt-4 border-t">
//           <span className="font-medium">Total</span>
//           <span className="font-medium">Tk{total.toFixed(2)}</span>
//         </div>

//         <div className="flex items-center justify-end gap-2 pt-4">
//           <Button
//             variant="outline"
//             onClick={() =>
//               isEdit ? setIsEditDialogOpen(false) : setIsCreateDialogOpen(false)
//             }
//           >
//             CANCEL
//           </Button>
//           {!isEdit && (
//             <Button variant="outline" onClick={handleSaveAsDraft}>
//               SAVE AS DRAFT
//             </Button>
//           )}
//           <Button
//             onClick={handleSave}
//             className="bg-green-500 hover:bg-green-600"
//           >
//             {isEdit ? 'SAVE' : 'CREATE'}
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   if (view === 'list') {
//     return (
//       <>
//         <div className="p-6 space-y-6">
//           <div className="flex items-center justify-between">
//             <Button
//               onClick={handleCreateNew}
//               className="bg-green-500 hover:bg-green-600"
//             >
//               <Plus className="mr-2 h-4 w-4" />
//               ADD PURCHASE ORDER
//             </Button>

//             <div className="flex items-center gap-4">
//               <div className="space-y-1">
//                 <Label className="text-sm text-muted-foreground">Status</Label>
//                 <Select value={statusFilter} onValueChange={setStatusFilter}>
//                   <SelectTrigger className="w-[180px]">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="All">All</SelectItem>
//                     <SelectItem value="Draft">Draft</SelectItem>
//                     <SelectItem value="Pending">Pending</SelectItem>
//                     <SelectItem value="Partially received">
//                       Partially received
//                     </SelectItem>
//                     <SelectItem value="Closed">Closed</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-1">
//                 <Label className="text-sm text-muted-foreground">
//                   Supplier
//                 </Label>
//                 <Select
//                   value={supplierFilter}
//                   onValueChange={setSupplierFilter}
//                 >
//                   <SelectTrigger className="w-[180px]">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="All suppliers">All suppliers</SelectItem>
//                     <SelectItem value="riad">riad</SelectItem>
//                     <SelectItem value="ziad">ziad</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

             
//              <div className="mt-6">
//                {!showSearch ? (
//                 <button
//                   onClick={() => setShowSearch(true)}
//                   className="p-2.5 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors w-full sm:w-auto"
//                 >
//                   <Search size={18} className="text-gray-600 mx-auto" />
//                 </button>
//               ) : (
//                 <div className="flex items-center gap-2">
//                   <div className="relative flex-1 sm:flex-none">
//                     <input
//                       type="text"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       placeholder="Search..."
//                       className="px-3 py-2 pr-8 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-48"
//                       autoFocus
//                     />
//                     {searchTerm && (
//                       <button
//                         onClick={() => setSearchTerm('')}
//                         className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                       >
//                         <X size={16} />
//                       </button>
//                     )}
//                   </div>
//                   <button
//                     onClick={() => {
//                       setShowSearch(false)
//                       setSearchTerm('')
//                     }}
//                     className="p-2.5 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors"
//                   >
//                     <X size={18} className="text-gray-600" />
//                   </button>
//                 </div>
//               )}
//              </div>
//             </div>
//           </div>

//           <Card>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Purchase order #</TableHead>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Supplier</TableHead>
//                   <TableHead>Store</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Received</TableHead>
//                   <TableHead>Expected on</TableHead>
//                   <TableHead className="text-right">Total</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredOrders.length === 0 ? (
//                   <TableRow>
//                     <TableCell
//                       colSpan={8}
//                       className="text-center py-8 text-muted-foreground"
//                     >
//                       No purchase orders found
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   filteredOrders.map((order) => {
//                     const total =
//                       order.items.reduce((sum, item) => sum + item.amount, 0) +
//                       order.additionalCosts.reduce(
//                         (sum, cost) => sum + cost.amount,
//                         0
//                       )
//                     return (
//                       <TableRow
//                         key={order.id}
//                         className="cursor-pointer"
//                         onClick={() => handleRowClick(order)}
//                       >
//                         <TableCell className="font-medium text-blue-600">
//                           {order.orderNumber}
//                         </TableCell>
//                         <TableCell>{order.date}</TableCell>
//                         <TableCell>{order.supplier}</TableCell>
//                         <TableCell>{order.destinationStore}</TableCell>
//                         <TableCell>
//                           <span
//                             className={`${
//                               order.status === 'Pending'
//                                 ? 'text-blue-600'
//                                 : order.status === 'Closed'
//                                   ? 'text-gray-600'
//                                   : 'text-orange-600'
//                             }`}
//                           >
//                             {order.status}
//                           </span>
//                         </TableCell>
//                         <TableCell>
//                           <div className="flex items-center gap-2">
//                             <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
//                               <div
//                                 className="bg-blue-600 h-2 rounded-full"
//                                 style={{
//                                   width: `${(Number.parseInt(order.received.split(' ')[0]) / Number.parseInt(order.received.split(' ')[2])) * 100}%`,
//                                 }}
//                               />
//                             </div>
//                             <span className="text-sm text-muted-foreground">
//                               {order.received}
//                             </span>
//                           </div>
//                         </TableCell>
//                         <TableCell>{order.expectedDate}</TableCell>
//                         <TableCell className="text-right font-medium">
//                           Tk{total.toFixed(2)}
//                         </TableCell>
//                       </TableRow>
//                     )
//                   })
//                 )}
//               </TableBody>
//             </Table>
//           </Card>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2 text-sm">
//               <span>Page:</span>
//               <Input
//                 type="number"
//                 value="1"
//                 readOnly
//                 className="w-16 h-8 text-center"
//               />
//               <span>of 1</span>
//             </div>
//             <div className="flex items-center gap-2 text-sm">
//               <span>Rows per page:</span>
//               <Select defaultValue="10">
//                 <SelectTrigger className="w-20 h-8">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="10">10</SelectItem>
//                   <SelectItem value="25">25</SelectItem>
//                   <SelectItem value="50">50</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </div>

//         <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//           <DialogContent className="max-w-4xl">
//             <DialogHeader>
//               <DialogTitle>Add purchase order</DialogTitle>
//             </DialogHeader>
//             {renderForm(false)}
//           </DialogContent>
//         </Dialog>
//       </>
//     )
//   }

//   // Detail View
//   const total = selectedOrder
//     ? selectedOrder.items.reduce((sum, item) => sum + item.amount, 0) +
//       selectedOrder.additionalCosts.reduce((sum, cost) => sum + cost.amount, 0)
//     : 0

//   return (
//     <>
//       <div className="p-6">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-4">
//             <Button variant="ghost" size="icon" onClick={handleBack}>
//               <ArrowLeft className="h-5 w-5" />
//             </Button>
//             <div>
//               <h1 className="text-2xl font-semibold">
//                 {selectedOrder?.orderNumber}
//               </h1>
//               <p className="text-sm text-muted-foreground">
//                 {selectedOrder?.supplier} • {selectedOrder?.date}
//               </p>
//             </div>
//           </div>
//           <div className="flex gap-2">
//             <Button variant="outline" onClick={handleExportToCSV}>
//               <FileDown className="h-4 w-4 mr-2" />
//               EXPORT TO CSV
//             </Button>
//             <Button variant="outline" onClick={handleEdit}>
//               EDIT
//             </Button>
//             <Button
//               onClick={handleReceive}
//               className="bg-green-500 hover:bg-green-600"
//             >
//               RECEIVE
//             </Button>
//           </div>
//         </div>

//         <div className="grid grid-cols-3 gap-6 mb-6">
//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle className="text-sm font-medium text-muted-foreground">
//                 Status
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <span
//                 className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
//                   selectedOrder?.status === 'Draft'
//                     ? 'bg-gray-100 text-gray-700'
//                     : selectedOrder?.status === 'Pending'
//                       ? 'bg-blue-100 text-blue-700'
//                       : selectedOrder?.status === 'Partially received'
//                         ? 'bg-orange-100 text-orange-700'
//                         : 'bg-green-100 text-green-700'
//                 }`}
//               >
//                 {selectedOrder?.status}
//               </span>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle className="text-sm font-medium text-muted-foreground">
//                 Expected date
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-lg font-medium">
//                 {selectedOrder?.expectedDate}
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="pb-3">
//               <CardTitle className="text-sm font-medium text-muted-foreground">
//                 Received
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-lg font-medium">{selectedOrder?.received}</p>
//             </CardContent>
//           </Card>
//         </div>

//         <Card className="mb-6">
//           <CardHeader>
//             <CardTitle>Items</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Item</TableHead>
//                   <TableHead className="text-right">In stock</TableHead>
//                   <TableHead className="text-right">Incoming</TableHead>
//                   <TableHead className="text-right">Quantity</TableHead>
//                   <TableHead className="text-right">Purchase cost</TableHead>
//                   <TableHead className="text-right">Amount</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {selectedOrder?.items.map((item) => (
//                   <TableRow key={item.id}>
//                     <TableCell>
//                       <div>
//                         <div className="font-medium">{item.name}</div>
//                         <div className="text-sm text-muted-foreground">
//                           SKU {item.sku}
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-right">{item.inStock}</TableCell>
//                     <TableCell className="text-right">
//                       {item.incoming}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       {item.quantity}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       Tk{item.purchaseCost.toFixed(2)}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       Tk{item.amount.toFixed(2)}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>

//         <Card className="mb-6">
//           <CardHeader>
//             <CardTitle>Additional costs</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-2">
//               {selectedOrder?.additionalCosts.map((cost) => (
//                 <div
//                   key={cost.id}
//                   className="flex items-center justify-between py-2"
//                 >
//                   <span>{cost.name}</span>
//                   <span className="font-medium">
//                     Tk{cost.amount.toFixed(2)}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {selectedOrder?.notes && (
//           <Card className="mb-6">
//             <CardHeader>
//               <CardTitle>Notes</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-sm text-muted-foreground">
//                 {selectedOrder.notes}
//               </p>
//             </CardContent>
//           </Card>
//         )}

//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center justify-between text-lg font-semibold">
//               <span>Total</span>
//               <span>Tk{total.toFixed(2)}</span>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//         <DialogContent className="max-w-4xl">
//           <DialogHeader>
//             <DialogTitle>Edit purchase order</DialogTitle>
//           </DialogHeader>
//           {renderForm(true)}
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isReceiveDialogOpen} onOpenChange={setIsReceiveDialogOpen}>
//         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <div className="flex items-center justify-between">
//               <DialogTitle>Items</DialogTitle>
//               <Button
//                 variant="link"
//                 onClick={handleMarkAllReceived}
//                 className="text-sm"
//               >
//                 MARK ALL RECEIVED
//               </Button>
//             </div>
//           </DialogHeader>

//           <div className="space-y-6">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Item</TableHead>
//                   <TableHead className="text-right">Ordered</TableHead>
//                   <TableHead className="text-right">Received</TableHead>
//                   <TableHead className="text-right">To receive</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {selectedOrder?.items.map((item) => {
//                   const receiveItem = receiveItems.find(
//                     (ri) => ri.itemId === item.id
//                   )
//                   return (
//                     <TableRow key={item.id}>
//                       <TableCell>
//                         <div>
//                           <div className="font-medium">{item.name}</div>
//                           <div className="text-sm text-muted-foreground">
//                             SKU {item.sku}
//                           </div>
//                         </div>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         {item.quantity}
//                       </TableCell>
//                       <TableCell className="text-right text-orange-600">
//                         0
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <Input
//                           type="number"
//                           min="0"
//                           max={item.quantity}
//                           value={receiveItem?.toReceive || 0}
//                           onChange={(e) =>
//                             handleReceiveQuantityChange(item.id, e.target.value)
//                           }
//                           className="w-20 text-right"
//                         />
//                       </TableCell>
//                     </TableRow>
//                   )
//                 })}
//               </TableBody>
//             </Table>

//             {selectedOrder && selectedOrder.additionalCosts.length > 0 && (
//               <div className="space-y-4">
//                 <p className="text-sm font-medium">
//                   Select additional costs to apply to this receipt (multiple
//                   selection allowed)
//                 </p>
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between text-sm text-muted-foreground pb-2 border-b">
//                     <span>Additional cost</span>
//                     <span>Amount</span>
//                   </div>
//                   {selectedOrder.additionalCosts.map((cost) => (
//                     <div
//                       key={cost.id}
//                       className="flex items-center justify-between"
//                     >
//                       <div className="flex items-center gap-2">
//                         <Checkbox
//                           id={cost.id}
//                           checked={selectedAdditionalCosts.includes(cost.id)}
//                           onCheckedChange={() =>
//                             handleToggleAdditionalCost(cost.id)
//                           }
//                         />
//                         <Label htmlFor={cost.id} className="cursor-pointer">
//                           {cost.name}
//                         </Label>
//                       </div>
//                       <span className="text-sm">
//                         Tk{cost.amount.toFixed(2)}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//                 {selectedAdditionalCosts.length > 0 && (
//                   <p className="text-xs text-muted-foreground">
//                     {selectedAdditionalCosts.length} cost
//                     {selectedAdditionalCosts.length > 1 ? 's' : ''} selected
//                   </p>
//                 )}
//               </div>
//             )}

//             <div className="flex justify-end gap-2 pt-4">
//               <Button
//                 variant="outline"
//                 onClick={() => setIsReceiveDialogOpen(false)}
//               >
//                 CANCEL
//               </Button>
//               <Button
//                 onClick={handleConfirmReceive}
//                 className="bg-green-600 hover:bg-green-700"
//               >
//                 RECEIVE
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }

// export default PurchaseOrders


'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Search, Trash2, ArrowLeft, FileDown, X, Menu } from 'lucide-react'

type PurchaseOrderStatus = 'Draft' | 'Pending' | 'Partially received' | 'Closed'

type Item = {
  id: string
  name: string
  sku: string
  inStock: number
  incoming: number
  quantity: number
  purchaseCost: number
  amount: number
}

type AdditionalCost = {
  id: string
  name: string
  amount: number
}

type PurchaseOrder = {
  id: string
  orderNumber: string
  date: string
  expectedDate: string
  orderedBy: string
  supplier: string
  supplierEmail: string
  supplierPhone: string
  destinationStore: string
  status: PurchaseOrderStatus
  received: string
  notes: string
  items: Item[]
  additionalCosts: AdditionalCost[]
}

type ReceiveItem = {
  itemId: string
  toReceive: number
}

type View = 'list' | 'detail'

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    orderNumber: 'PO1001',
    date: 'Dec 17, 2025',
    expectedDate: 'Dec 18, 2025',
    orderedBy: 'Owner',
    supplier: 'riad',
    supplierEmail: 'riaodiy37@gmail.com',
    supplierPhone: '01876980021',
    destinationStore: 'new business',
    status: 'Pending',
    received: '0 of 3',
    notes: 'test note',
    items: [
      {
        id: '1',
        name: 'new item (medium / large)',
        sku: '10000',
        inStock: 1200,
        incoming: 0,
        quantity: 1,
        purchaseCost: 10.0,
        amount: 10.0,
      },
      {
        id: '2',
        name: 'new items 2 (xxl)',
        sku: '10001',
        inStock: 0,
        incoming: 0,
        quantity: 2,
        purchaseCost: 1200.0,
        amount: 2400.0,
      },
    ],
    additionalCosts: [
      { id: '1', name: 'new cost', amount: 450.0 },
      { id: '2', name: 'cost 2', amount: 250.0 },
    ],
  },
]

const PurchaseOrders = () => {
  const [view, setView] = useState<View>('list')
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null)
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders)
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [supplierFilter, setSupplierFilter] = useState<string>('All suppliers')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isReceiveDialogOpen, setIsReceiveDialogOpen] = useState(false)
  const [receiveItems, setReceiveItems] = useState<ReceiveItem[]>([])
  const [selectedAdditionalCosts, setSelectedAdditionalCosts] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const [formData, setFormData] = useState<Partial<PurchaseOrder>>({
    supplier: '',
    date: '',
    expectedDate: '',
    notes: '',
    items: [],
    additionalCosts: [],
  })

  const handleRowClick = (order: PurchaseOrder) => {
    setSelectedOrder(order)
    setView('detail')
  }

  const handleCreateNew = () => {
    setFormData({
      supplier: '',
      date: new Date().toISOString().split('T')[0],
      expectedDate: '',
      notes: '',
      items: [],
      additionalCosts: [],
    })
    setIsCreateDialogOpen(true)
  }

  const handleEdit = () => {
    if (selectedOrder) {
      setFormData(selectedOrder)
      setIsEditDialogOpen(true)
    }
  }

  const handleBack = () => {
    setView('list')
    setSelectedOrder(null)
  }

  const handleAddItem = () => {
    const newItem: Item = {
      id: Date.now().toString(),
      name: '',
      sku: '',
      inStock: 0,
      incoming: 0,
      quantity: 0,
      purchaseCost: 0,
      amount: 0,
    }
    setFormData({
      ...formData,
      items: [...(formData.items || []), newItem],
    })
  }

  const handleRemoveItem = (itemId: string) => {
    setFormData({
      ...formData,
      items: formData.items?.filter((item) => item.id !== itemId),
    })
  }

  const handleItemChange = (itemId: string, field: keyof Item, value: any) => {
    const updatedItems = formData.items?.map((item) => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value }
        if (field === 'quantity' || field === 'purchaseCost') {
          updatedItem.amount = updatedItem.quantity * updatedItem.purchaseCost
        }
        return updatedItem
      }
      return item
    })
    setFormData({ ...formData, items: updatedItems })
  }

  const handleAddAdditionalCost = () => {
    const newCost: AdditionalCost = {
      id: Date.now().toString(),
      name: '',
      amount: 0,
    }
    setFormData({
      ...formData,
      additionalCosts: [...(formData.additionalCosts || []), newCost],
    })
  }

  const handleRemoveAdditionalCost = (costId: string) => {
    setFormData({
      ...formData,
      additionalCosts: formData.additionalCosts?.filter((cost) => cost.id !== costId),
    })
  }

  const handleAdditionalCostChange = (costId: string, field: keyof AdditionalCost, value: any) => {
    const updatedCosts = formData.additionalCosts?.map((cost) =>
      cost.id === costId ? { ...cost, [field]: value } : cost
    )
    setFormData({ ...formData, additionalCosts: updatedCosts })
  }

  const calculateTotal = () => {
    const itemsTotal = formData.items?.reduce((sum, item) => sum + item.amount, 0) || 0
    const costsTotal = formData.additionalCosts?.reduce((sum, cost) => sum + cost.amount, 0) || 0
    return itemsTotal + costsTotal
  }

  const handleSave = () => {
    if (isCreateDialogOpen) {
      const newOrder: PurchaseOrder = {
        id: Date.now().toString(),
        orderNumber: `PO${1001 + purchaseOrders.length}`,
        orderedBy: 'Owner',
        status: 'Pending',
        received: `0 of ${formData.items?.length || 0}`,
        supplierEmail: '',
        supplierPhone: '',
        destinationStore: 'new business',
        ...formData,
      } as PurchaseOrder
      setPurchaseOrders([...purchaseOrders, newOrder])
      setIsCreateDialogOpen(false)
    } else if (isEditDialogOpen && selectedOrder) {
      const updatedOrders = purchaseOrders.map((order) =>
        order.id === selectedOrder.id ? { ...order, ...formData } : order
      )
      setPurchaseOrders(updatedOrders)
      setSelectedOrder({ ...selectedOrder, ...formData } as PurchaseOrder)
      setIsEditDialogOpen(false)
    }
  }

  const handleSaveAsDraft = () => {
    const newOrder: PurchaseOrder = {
      id: Date.now().toString(),
      orderNumber: `PO${1001 + purchaseOrders.length}`,
      orderedBy: 'Owner',
      status: 'Draft',
      received: `0 of ${formData.items?.length || 0}`,
      supplierEmail: '',
      supplierPhone: '',
      destinationStore: 'new business',
      ...formData,
    } as PurchaseOrder
    setPurchaseOrders([...purchaseOrders, newOrder])
    setIsCreateDialogOpen(false)
  }

  const handleExportToCSV = () => {
    if (!selectedOrder) return

    const total =
      selectedOrder.items.reduce((sum, item) => sum + item.amount, 0) +
      selectedOrder.additionalCosts.reduce((sum, cost) => sum + cost.amount, 0)

    let csv = 'Purchase Order Details\n\n'
    csv += `Order Number:,${selectedOrder.orderNumber}\n`
    csv += `Status:,${selectedOrder.status}\n`
    csv += `Date:,${selectedOrder.date}\n`
    csv += `Expected Date:,${selectedOrder.expectedDate}\n`
    csv += `Ordered By:,${selectedOrder.orderedBy}\n`
    csv += `Supplier:,${selectedOrder.supplier}\n`
    csv += `Destination Store:,${selectedOrder.destinationStore}\n`
    csv += `Notes:,${selectedOrder.notes}\n\n`

    csv += 'Items\n'
    csv += 'Item,SKU,Quantity,Purchase Cost,Amount\n'
    selectedOrder.items.forEach((item) => {
      csv += `"${item.name}",${item.sku},${item.quantity},Tk${item.purchaseCost.toFixed(2)},Tk${item.amount.toFixed(2)}\n`
    })

    csv += '\nAdditional Costs\n'
    csv += 'Name,Amount\n'
    selectedOrder.additionalCosts.forEach((cost) => {
      csv += `${cost.name},Tk${cost.amount.toFixed(2)}\n`
    })

    csv += `\nTotal:,Tk${total.toFixed(2)}\n`

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${selectedOrder.orderNumber}_export.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleReceive = () => {
    if (selectedOrder) {
      const items = selectedOrder.items.map((item) => ({
        itemId: item.id,
        toReceive: 0,
      }))
      setReceiveItems(items)
      setSelectedAdditionalCosts([])
      setIsReceiveDialogOpen(true)
    }
  }

  const handleMarkAllReceived = () => {
    if (selectedOrder) {
      const items = selectedOrder.items.map((item) => ({
        itemId: item.id,
        toReceive: item.quantity,
      }))
      setReceiveItems(items)

      if (selectedOrder.additionalCosts) {
        const allCostIds = selectedOrder.additionalCosts.map((cost) => cost.id)
        setSelectedAdditionalCosts(allCostIds)
      }
    }
  }

  const handleReceiveQuantityChange = (itemId: string, value: string) => {
    const numValue = Number.parseInt(value) || 0
    setReceiveItems((prev) =>
      prev.map((item) =>
        item.itemId === itemId ? { ...item, toReceive: numValue } : item
      )
    )
  }

  const handleToggleAdditionalCost = (costId: string) => {
    setSelectedAdditionalCosts((prev) =>
      prev.includes(costId) ? prev.filter((id) => id !== costId) : [...prev, costId]
    )
  }

  const handleConfirmReceive = () => {
    if (!selectedOrder) return

    const totalReceived = receiveItems.reduce((sum, item) => sum + item.toReceive, 0)
    const totalOrdered = selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)

    const updatedOrder = {
      ...selectedOrder,
      received: `${totalReceived} of ${totalOrdered}`,
      status: (totalReceived >= totalOrdered ? 'Closed' : 'Partially received') as PurchaseOrderStatus,
    }

    setPurchaseOrders((prev) =>
      prev.map((order) => (order.id === selectedOrder.id ? updatedOrder : order))
    )
    setSelectedOrder(updatedOrder)
    setIsReceiveDialogOpen(false)
  }

  const filteredOrders = purchaseOrders.filter((order) => {
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter
    const matchesSupplier = supplierFilter === 'All suppliers' || order.supplier === supplierFilter
    const matchesSearch =
      searchTerm === '' ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.destinationStore.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSupplier && matchesSearch
  })

  const renderForm = (isEdit: boolean) => {
    const total = calculateTotal()

    return (
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        <div>
          <Label htmlFor="supplier">Supplier</Label>
          <Input
            id="supplier"
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            placeholder="Enter supplier name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Purchase order date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="expectedDate">Expected on</Label>
            <Input
              id="expectedDate"
              type="date"
              value={formData.expectedDate}
              onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add notes..."
            className="min-h-[80px]"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {formData.notes?.length || 0} / 500
          </p>
        </div>

        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
            <h3 className="font-medium">Items</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                IMPORT
              </Button>
              {!isEdit && (
                <Button variant="outline" size="sm">
                  AUTOFILL
                </Button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto -mx-2 px-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Item</TableHead>
                  <TableHead className="text-right">In stock</TableHead>
                  <TableHead className="text-right">Incoming</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Purchase cost</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        value={item.name}
                        onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                        placeholder="Item name"
                        className="min-w-[200px]"
                      />
                      <Input
                        value={item.sku}
                        onChange={(e) => handleItemChange(item.id, 'sku', e.target.value)}
                        placeholder="SKU"
                        className="mt-1 text-sm"
                      />
                    </TableCell>
                    <TableCell className="text-right">{item.inStock}</TableCell>
                    <TableCell className="text-right">{item.incoming}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                        className="w-20 text-right"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.purchaseCost}
                        onChange={(e) => handleItemChange(item.id, 'purchaseCost', Number(e.target.value))}
                        className="w-24 text-right"
                      />
                    </TableCell>
                    <TableCell className="text-right">Tk{item.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Button variant="link" onClick={handleAddItem} className="mt-2">
            Search item
          </Button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Additional cost</h3>
            <span className="font-medium">Amount</span>
          </div>

          <div className="space-y-2">
            {formData.additionalCosts?.map((cost) => (
              <div key={cost.id} className="flex items-center gap-2">
                <Input
                  value={cost.name}
                  onChange={(e) => handleAdditionalCostChange(cost.id, 'name', e.target.value)}
                  placeholder="Cost name"
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={cost.amount}
                  onChange={(e) => handleAdditionalCostChange(cost.id, 'amount', Number(e.target.value))}
                  className="w-32 text-right"
                />
                <Button variant="ghost" size="icon" onClick={() => handleRemoveAdditionalCost(cost.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button variant="link" onClick={handleAddAdditionalCost} className="mt-2">
            <Plus className="h-4 w-4 mr-1" />
            ADD ADDITIONAL COST
          </Button>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <span className="font-medium">Total</span>
          <span className="font-medium">Tk{total.toFixed(2)}</span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => (isEdit ? setIsEditDialogOpen(false) : setIsCreateDialogOpen(false))}
            className="w-full sm:w-auto"
          >
            CANCEL
          </Button>
          {!isEdit && (
            <Button variant="outline" onClick={handleSaveAsDraft} className="w-full sm:w-auto">
              SAVE AS DRAFT
            </Button>
          )}
          <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600 w-full sm:w-auto">
            {isEdit ? 'SAVE' : 'CREATE'}
          </Button>
        </div>
      </div>
    )
  }

  if (view === 'list') {
    return (
      <>
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <Button onClick={handleCreateNew} className="bg-green-500 hover:bg-green-600 w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              ADD PURCHASE ORDER
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Menu className="h-4 w-4" />
              </Button>

              {!showSearch ? (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowSearch(true)}
                  className="flex-shrink-0"
                >
                  <Search className="h-4 w-4" />
                </Button>
              ) : (
                <div className="flex items-center gap-2 flex-1">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search..."
                      className="pr-8"
                      autoFocus
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setShowSearch(false)
                      setSearchTerm('')
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className={`${showFilters ? 'flex' : 'hidden md:flex'} flex-col md:flex-row items-stretch md:items-end gap-4`}>
            <div className="space-y-1 flex-1">
              <Label className="text-sm text-muted-foreground">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Partially received">Partially received</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 flex-1">
              <Label className="text-sm text-muted-foreground">Supplier</Label>
              <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All suppliers">All suppliers</SelectItem>
                  <SelectItem value="riad">riad</SelectItem>
                  <SelectItem value="ziad">ziad</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">Purchase order #</TableHead>
                    <TableHead className="min-w-[100px]">Date</TableHead>
                    <TableHead className="min-w-[120px]">Supplier</TableHead>
                    <TableHead className="min-w-[120px]">Store</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[140px]">Received</TableHead>
                    <TableHead className="min-w-[120px]">Expected on</TableHead>
                    <TableHead className="text-right min-w-[100px]">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No purchase orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => {
                      const total =
                        order.items.reduce((sum, item) => sum + item.amount, 0) +
                        order.additionalCosts.reduce((sum, cost) => sum + cost.amount, 0)
                      return (
                        <TableRow key={order.id} className="cursor-pointer" onClick={() => handleRowClick(order)}>
                          <TableCell className="font-medium text-blue-600">{order.orderNumber}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>{order.supplier}</TableCell>
                          <TableCell>{order.destinationStore}</TableCell>
                          <TableCell>
                            <span
                              className={`${
                                order.status === 'Pending'
                                  ? 'text-blue-600'
                                  : order.status === 'Closed'
                                    ? 'text-gray-600'
                                    : 'text-orange-600'
                              }`}
                            >
                              {order.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{
                                    width: `${(Number.parseInt(order.received.split(' ')[0]) / Number.parseInt(order.received.split(' ')[2])) * 100}%`,
                                  }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground whitespace-nowrap">{order.received}</span>
                            </div>
                          </TableCell>
                          <TableCell>{order.expectedDate}</TableCell>
                          <TableCell className="text-right font-medium">Tk{total.toFixed(2)}</TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span>Page:</span>
              <Input type="number" value="1" readOnly className="w-16 h-8 text-center" />
              <span>of 1</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>Rows per page:</span>
              <Select defaultValue="10">
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add purchase order</DialogTitle>
            </DialogHeader>
            {renderForm(false)}
          </DialogContent>
        </Dialog>
      </>
    )
  }

  const total = selectedOrder
    ? selectedOrder.items.reduce((sum, item) => sum + item.amount, 0) +
      selectedOrder.additionalCosts.reduce((sum, cost) => sum + cost.amount, 0)
    : 0

  return (
    <>
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-semibold">{selectedOrder?.orderNumber}</h1>
              <p className="text-sm text-muted-foreground">
                {selectedOrder?.supplier} • {selectedOrder?.date}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={handleExportToCSV} className="flex-1 sm:flex-none">
              <FileDown className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">EXPORT TO CSV</span>
              <span className="sm:hidden">EXPORT</span>
            </Button>
            <Button variant="outline" onClick={handleEdit} className="flex-1 sm:flex-none">
              EDIT
            </Button>
            <Button onClick={handleReceive} className="bg-green-500 hover:bg-green-600 flex-1 sm:flex-none">
              RECEIVE
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  selectedOrder?.status === 'Draft'
                    ? 'bg-gray-100 text-gray-700'
                    : selectedOrder?.status === 'Pending'
                      ? 'bg-blue-100 text-blue-700'
                      : selectedOrder?.status === 'Partially received'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-green-100 text-green-700'
                }`}
              >
                {selectedOrder?.status}
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Expected date</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">{selectedOrder?.expectedDate}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Received</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">{selectedOrder?.received}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Item</TableHead>
                    <TableHead className="text-right">In stock</TableHead>
                    <TableHead className="text-right">Incoming</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Purchase cost</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOrder?.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">SKU {item.sku}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{item.inStock}</TableCell>
                      <TableCell className="text-right">{item.incoming}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">Tk{item.purchaseCost.toFixed(2)}</TableCell>
                      <TableCell className="text-right">Tk{item.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Additional costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedOrder?.additionalCosts.map((cost) => (
                <div key={cost.id} className="flex items-center justify-between py-2">
                  <span>{cost.name}</span>
                  <span className="font-medium">Tk{cost.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedOrder?.notes && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total</span>
              <span>Tk{total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit purchase order</DialogTitle>
          </DialogHeader>
          {renderForm(true)}
        </DialogContent>
      </Dialog>

      <Dialog open={isReceiveDialogOpen} onOpenChange={setIsReceiveDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <DialogTitle>Items</DialogTitle>
              <Button variant="link" onClick={handleMarkAllReceived} className="text-sm p-0 h-auto">
                MARK ALL RECEIVED
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[180px]">Item</TableHead>
                    <TableHead className="text-right">Ordered</TableHead>
                    <TableHead className="text-right">Received</TableHead>
                    <TableHead className="text-right">To receive</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOrder?.items.map((item) => {
                    const receiveItem = receiveItems.find((ri) => ri.itemId === item.id)
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">SKU {item.sku}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right text-orange-600">0</TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            min="0"
                            max={item.quantity}
                            value={receiveItem?.toReceive || 0}
                            onChange={(e) => handleReceiveQuantityChange(item.id, e.target.value)}
                            className="w-20 text-right ml-auto"
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {selectedOrder && selectedOrder.additionalCosts.length > 0 && (
              <div className="space-y-4">
                <p className="text-sm font-medium">
                  Select additional costs to apply to this receipt (multiple selection allowed)
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground pb-2 border-b">
                    <span>Additional cost</span>
                    <span>Amount</span>
                  </div>
                  {selectedOrder.additionalCosts.map((cost) => (
                    <div key={cost.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={cost.id}
                          checked={selectedAdditionalCosts.includes(cost.id)}
                          onCheckedChange={() => handleToggleAdditionalCost(cost.id)}
                        />
                        <Label htmlFor={cost.id} className="cursor-pointer">
                          {cost.name}
                        </Label>
                      </div>
                      <span className="text-sm">Tk{cost.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                {selectedAdditionalCosts.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {selectedAdditionalCosts.length} cost{selectedAdditionalCosts.length > 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsReceiveDialogOpen(false)} className="w-full sm:w-auto">
                CANCEL
              </Button>
              <Button onClick={handleConfirmReceive} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                RECEIVE
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PurchaseOrders