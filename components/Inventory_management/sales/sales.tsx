'use client'
import React, { useState, useMemo, useEffect, useRef } from 'react'
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  ShoppingCart,
  DollarSign,
  Package,
  Camera,
  CameraOff,
} from 'lucide-react'
import {
  useSales,
  useCreateSale,
  useEditSale,
  useDeleteSale,
} from '@/hooks/use.sales'
import { useCustomers } from '@/hooks/use-customers'
import { useItems } from '@/hooks/use-items'
import { CreateSaleRequest, UpdateSaleRequest } from '@/types/sales'

// Load html5-qrcode library
declare global {
  interface Window {
    Html5Qrcode: any
  }
}

// Component types based on API response
interface SaleItem {
  itemId: number
  itemName: string
  quantity: number
  unitPrice: number
  amount: number
}

interface Sale {
  saleMasterId: number
  customerId: number
  customerName: string
  saleDate: string
  totalAmount: number
  status: string
  items: SaleItem[]
}

interface FormData {
  customerId: number | string
  saleDate: string
  status: string
  items: SaleItem[]
}

export default function SalesManagement() {
  const { data: salesData, isLoading: salesLoading } = useSales()
  const { data: customer } = useCustomers()
  const { data: itemproduct } = useItems()

  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [showScanner, setShowScanner] = useState(false)
  const [scanning, setScanning] = useState(false)
  const scannerRef = useRef<any>(null)
  const [scannerLoaded, setScannerLoaded] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    customerId: '',
    saleDate: new Date().toISOString().split('T')[0],
    status: 'completed',
    items: [],
  })

  // Reset form helper
  const resetForm = () => {
    setFormData({
      customerId: '',
      saleDate: new Date().toISOString().split('T')[0],
      status: 'completed',
      items: [],
    })
    setSelectedSale(null)
  }

  // Initialize mutation hooks
  const createMutation = useCreateSale({
    onClose: () => setShowModal(false),
    reset: resetForm,
  })

  const editMutation = useEditSale({
    onClose: () => setShowModal(false),
    reset: resetForm,
  })

  const deleteMutation = useDeleteSale()

  // Transform API data to component format
  const transformedSales: Sale[] = useMemo(() => {
    if (!salesData) return []

    try {
      const dataArray = salesData as unknown as any[]

      if (!Array.isArray(dataArray)) {
        console.error('Expected salesData to be an array')
        return []
      }

      return dataArray
        .filter((sale: any) => sale && typeof sale === 'object')
        .map((sale: any) => ({
          saleMasterId: sale.saleMasterId || 0,
          customerId: sale.customerId || 0,
          customerName: sale.customerName || 'Unknown',
          saleDate: sale.saleDate
            ? new Date(sale.saleDate).toISOString().split('T')[0]
            : '',
          totalAmount: sale.totalAmount || 0,
          status: sale.status || 'completed',
          items: (sale.Details || []).map((detail: any) => ({
            itemId: detail.itemId || 0,
            itemName: detail.itemName || '',
            quantity: detail.quantity || 0,
            unitPrice: detail.unitPrice || 0,
            amount: detail.amount || 0,
          })),
        }))
    } catch (error) {
      console.error('Error transforming sales data:', error)
      return []
    }
  }, [salesData])

  // Load barcode scanner library
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js'
    script.async = true
    script.onload = () => {
      setScannerLoaded(true)
    }
    document.body.appendChild(script)

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch((err: any) => console.error(err))
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  // Cleanup scanner on unmount or modal close
  useEffect(() => {
    if (!showModal && scannerRef.current) {
      scannerRef.current.stop().catch((err: any) => console.error(err))
      scannerRef.current = null
      setScanning(false)
    }
  }, [showModal])

  const filteredSales = transformedSales.filter(
    (sale) =>
      sale?.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale?.saleMasterId?.toString().includes(searchTerm)
  )

  const handleCreate = () => {
    setModalMode('create')
    resetForm()
    setShowModal(true)
  }

  const handleEdit = (sale: Sale) => {
    setModalMode('edit')
    setSelectedSale(sale)
    setFormData({
      customerId: sale.customerId,
      saleDate: sale.saleDate,
      status: sale.status,
      items: sale.items,
    })
    setShowModal(true)
  }

  const handleDelete = (saleId: number) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      deleteMutation.mutate(saleId.toString())
    }
  }

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { itemId: 0, itemName: '', quantity: 1, unitPrice: 0, amount: 0 },
      ],
    })
  }

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    })
  }

  const handleItemChange = (
    index: number,
    field: keyof SaleItem,
    value: string | number
  ) => {
    const newItems = [...formData.items]

    if (field === 'itemId') {
      const itemId = typeof value === 'string' ? parseInt(value) : value
      newItems[index].itemId = itemId

      const selectedProduct = itemproduct?.find(
        (product) => product.itemId === itemId
      )

      if (selectedProduct) {
        newItems[index].unitPrice = parseFloat(selectedProduct.price) || 0
        newItems[index].itemName = selectedProduct.name || ''
        newItems[index].amount =
          newItems[index].quantity * newItems[index].unitPrice
      }
    } else if (field === 'quantity') {
      const qty = typeof value === 'string' ? parseFloat(value) : value
      newItems[index].quantity = isNaN(qty) ? 0 : qty
      newItems[index].amount =
        newItems[index].quantity * newItems[index].unitPrice
    } else if (field === 'unitPrice') {
      const price = typeof value === 'string' ? parseFloat(value) : value
      newItems[index].unitPrice = isNaN(price) ? 0 : price
      newItems[index].amount =
        newItems[index].quantity * newItems[index].unitPrice
    }

    setFormData({ ...formData, items: newItems })
  }

  const calculateTotal = (): number => {
    return formData.items.reduce((sum, item) => sum + (item.amount || 0), 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.customerId) {
      alert('Please select a customer')
      return
    }

    if (formData.items.length === 0) {
      alert('Please add at least one item')
      return
    }

    // Check if all items have valid data
    const invalidItems = formData.items.some(
      (item) => !item.itemId || item.quantity <= 0 || item.unitPrice <= 0
    )

    if (invalidItems) {
      alert('Please ensure all items have valid product, quantity, and price')
      return
    }

    const totalAmount = calculateTotal()
    const totalQuantity = formData.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    )

    if (modalMode === 'create') {
      const createData: CreateSaleRequest = {
        sale: {
          paymentType: 'cash',
          customerId: Number(formData.customerId),
          saleDate: formData.saleDate,
          totalQuantity: totalQuantity,
          totalAmount: totalAmount,
          discountAmount: 0,
          notes: null,
        },
        items: formData.items.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: item.amount,
        })),
      }
      createMutation.mutate(createData)
    } else if (selectedSale) {
      const updateData: UpdateSaleRequest = {
        sale: {
          paymentType: 'cash',
          customerId: Number(formData.customerId),
          saleDate: formData.saleDate,
          totalQuantity: totalQuantity,
          totalAmount: totalAmount,
          discountAmount: 0,
          notes: null,
        },
        items: formData.items.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: item.amount,
        })),
      }
      editMutation.mutate({
        id: selectedSale.saleMasterId.toString(),
        data: updateData,
      })
    }
  }

  // Barcode Scanner Functions
  const startCamera = async () => {
    if (!scannerLoaded || !window.Html5Qrcode) {
      alert('Scanner library is still loading. Please try again in a moment.')
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 100))

    const readerElement = document.getElementById('qr-reader')
    if (!readerElement) {
      console.error('Scanner element not found')
      return
    }

    try {
      const html5QrCode = new window.Html5Qrcode('qr-reader')
      scannerRef.current = html5QrCode

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
        },
        (decodedText: string) => {
          handleBarcodeDetected(decodedText)
        },
        (errorMessage: string) => {
          // Ignore scanning errors
        }
      )

      setScanning(true)
    } catch (err) {
      console.error('Error starting camera:', err)
      alert(
        'Unable to access camera. Please check permissions and ensure you are using HTTPS.'
      )
    }
  }

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
        scannerRef.current = null
      } catch (err) {
        console.error('Error stopping camera:', err)
      }
    }
    setScanning(false)
    setShowScanner(false)
  }

  const handleBarcodeDetected = (barcode: string) => {
    const product = itemproduct?.find(
      (p: any) => p.barcode === barcode || p.itemId.toString() === barcode
    )

    if (product) {
      const existingIndex = formData.items.findIndex(
        (item) => item.itemId === product.itemId
      )

      if (existingIndex >= 0) {
        const newItems = [...formData.items]
        newItems[existingIndex].quantity += 1
        newItems[existingIndex].amount =
          newItems[existingIndex].quantity * newItems[existingIndex].unitPrice
        setFormData({ ...formData, items: newItems })
      } else {
        const newItem: SaleItem = {
          itemId: product.itemId,
          itemName: product.name,
          quantity: 1,
          unitPrice: parseFloat(product.price) || 0,
          amount: parseFloat(product.price) || 0,
        }
        setFormData({
          ...formData,
          items: [...formData.items, newItem],
        })
      }

      stopCamera()
    } else {
      alert('Product not found with this barcode')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-3 rounded-xl">
                <ShoppingCart className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  Sales Management
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Manage your sales transactions
                </p>
              </div>
            </div>
            <button
              onClick={handleCreate}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              New Sale
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by customer name or sale ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Sales Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">
                  Total Sales
                </p>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  {transformedSales.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  ৳
                  {transformedSales
                    .reduce((sum, s) => sum + s.totalAmount, 0)
                    .toFixed(2)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">
                  Avg Sale Value
                </p>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  ৳
                  {transformedSales.length
                    ? (
                        transformedSales.reduce(
                          (sum, s) => sum + s.totalAmount,
                          0
                        ) / transformedSales.length
                      ).toFixed(2)
                    : '0.00'}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {salesLoading && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-500">Loading sales data...</p>
          </div>
        )}

        {/* Sales Table */}
        {!salesLoading && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Customer
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Date
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Items
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Total
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Status
                    </th>
                    {/* <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">
                      Actions
                    </th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredSales.map((sale, index) => (
                    <tr
                      key={sale.saleMasterId || `sale-${index}`}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-700">
                            {sale.customerName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-600 text-sm">
                            {sale.saleDate}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-600">
                          {sale.items.length} items
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-green-600">
                          ৳{sale.totalAmount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {sale.status}
                        </span>
                      </td>
                      {/* <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(sale)}
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(sale.saleMasterId)}
                            disabled={deleteMutation.isPending}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredSales.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No sales found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">
                {modalMode === 'create' ? 'Create New Sale' : 'Edit Sale'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Customer *
                  </label>
                  <select
                    value={formData.customerId}
                    onChange={(e) =>
                      setFormData({ ...formData, customerId: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select customer</option>
                    {customer?.map((cust) => (
                      <option key={cust.customerId} value={cust.customerId}>
                        {cust.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sale Date *
                  </label>
                  <input
                    type="date"
                    value={formData.saleDate}
                    onChange={(e) =>
                      setFormData({ ...formData, saleDate: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Items Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Sale Items
                  </h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!showScanner) {
                          setShowScanner(true)
                          setTimeout(() => startCamera(), 200)
                        } else {
                          stopCamera()
                        }
                      }}
                      className={`${
                        showScanner
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-green-500 hover:bg-green-600'
                      } text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors`}
                    >
                      {showScanner ? (
                        <>
                          <CameraOff className="w-4 h-4" />
                          Stop Scanner
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4" />
                          Scan Barcode
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 px-4 py-2 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Item
                    </button>
                  </div>
                </div>

                {/* Barcode Scanner */}
                {showScanner && (
                  <div className="mb-4 bg-slate-900 rounded-xl p-4">
                    <div id="qr-reader" className="w-full"></div>
                    <p className="text-white text-sm text-center mt-3">
                      {scanning
                        ? 'Scanning... Position barcode in view'
                        : 'Initializing camera...'}
                    </p>
                    <div className="mt-3">
                      <input
                        type="text"
                        placeholder="Or enter barcode manually and press Enter"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value) {
                            handleBarcodeDetected(e.currentTarget.value)
                            e.currentTarget.value = ''
                          }
                        }}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {formData.items.map((item, index) => (
                    <div key={index} className="bg-slate-50 rounded-xl p-4">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Product
                          </label>
                          <select
                            value={item.itemId}
                            onChange={(e) =>
                              handleItemChange(index, 'itemId', e.target.value)
                            }
                            required
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          >
                            <option value="">Select product</option>
                            {itemproduct?.map((product) => (
                              <option
                                key={product.itemId}
                                value={product.itemId}
                              >
                                {product.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Quantity
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity || ''}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                'quantity',
                                e.target.value
                              )
                            }
                            required
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Unit Price
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.unitPrice || ''}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                'unitPrice',
                                e.target.value
                              )
                            }
                            required
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-blue-50"
                          />
                        </div>

                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                              Amount
                            </label>
                            <input
                              type="text"
                              value={`${(item.amount || 0).toFixed(2)}`}
                              readOnly
                              className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {formData.items.length === 0 && (
                  <div className="text-center py-8 bg-slate-50 rounded-xl">
                    <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">No items added yet</p>
                    <p className="text-slate-400 text-xs mt-1">
                      Use the barcode scanner or add items manually
                    </p>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-slate-700">
                    Total Amount:
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    ৳{calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || editMutation.isPending}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl flex items-center gap-2 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createMutation.isPending || editMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {modalMode === 'create' ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {modalMode === 'create' ? 'Create Sale' : 'Update Sale'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
