"use client"
import { useState } from "react"
import { ChevronLeft, ChevronRight, Search, Calendar, Plus, MoreVertical, X, Download } from "lucide-react"
import * as XLSX from 'xlsx'

interface TransferOrder {
  id: string
  date: string
  received: string | null
  sourceStore: string
  destinationStore: string
  status: string
  quantity: number
  fullSourceStore: string
  fullDestinationStore: string
  notes: string
  items: Array<{
    name: string
    sku: string
    quantity: number
  }>
}

const TransferOrders = () => {
  const [view, setView] = useState<"list" | "detail" | "create" | "edit">("list")
  const [selectedOrder, setSelectedOrder] = useState<TransferOrder | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [sourceStoreFilter, setSourceStoreFilter] = useState("All stores")
  const [destinationStoreFilter, setDestinationStoreFilter] = useState("All stores")
  const [showSearch, setShowSearch] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  
  // Edit form state
  const [editForm, setEditForm] = useState<TransferOrder | null>(null)

  const orders: TransferOrder[] = [
    {
      id: "TO1002",
      date: "Dec 28, 2025",
      received: null,
      sourceStore: "new store chawkhba...",
      destinationStore: "new business",
      status: "In transit",
      quantity: 5,
      fullSourceStore: "new store chawkhbazar\nchandon pura, school road",
      fullDestinationStore: "new business\nfoyez lack",
      notes: "new store to new store chawkhbazar",
      items: [{ name: "new item (large / small)", sku: "cake-1kg", quantity: 5 }],
    },
    {
      id: "TO1001",
      date: "Dec 28, 2025",
      received: "Dec 28, 2025",
      sourceStore: "new business",
      destinationStore: "new store chawkhba...",
      status: "Transferred",
      quantity: 21,
      fullSourceStore: "new business\nfoyez lack",
      fullDestinationStore: "new store chawkhbazar\nchandon pura, school road",
      notes: "order transfer one store to another store",
      items: [{ name: "new item (medium / large)", sku: "10000", quantity: 21 }],
    },
  ]

  const handleViewDetail = (order: TransferOrder) => {
    setSelectedOrder(order)
    setView("detail")
  }

  const handleEdit = () => {
    setEditForm({ ...selectedOrder! })
    setView("edit")
  }

  const handleSaveEdit = () => {
    setSelectedOrder(editForm)
    setView("detail")
  }

  const downloadPDF = () => {
    if (!selectedOrder) return

    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Transfer Order ${selectedOrder.id}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #22c55e;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #22c55e;
            margin: 0;
            font-size: 32px;
          }
          .header p {
            color: #666;
            margin: 5px 0;
          }
          .section {
            margin: 25px 0;
          }
          .section-title {
            font-weight: bold;
            font-size: 14px;
            color: #22c55e;
            margin-bottom: 8px;
            text-transform: uppercase;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
          }
          .info-box {
            background: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #22c55e;
          }
          .info-label {
            font-weight: bold;
            color: #374151;
            margin-bottom: 5px;
          }
          .info-value {
            color: #6b7280;
            white-space: pre-line;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          th {
            background: #22c55e;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
          }
          tr:hover {
            background: #f9fafb;
          }
          .item-name {
            font-weight: 500;
            color: #111827;
          }
          .item-sku {
            color: #6b7280;
            font-size: 12px;
          }
          .total-row {
            font-weight: bold;
            background: #f3f4f6;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
          }
          .status-transit {
            background: #fef3c7;
            color: #f59e0b;
          }
          .status-transferred {
            background: #d1fae5;
            color: #059669;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #9ca3af;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>TRANSFER ORDER</h1>
          <p style="font-size: 24px; color: #22c55e; font-weight: bold;">${selectedOrder.id}</p>
          <span class="status-badge status-${selectedOrder.status === 'Transferred' ? 'transferred' : 'transit'}">
            ${selectedOrder.status.toUpperCase()}
          </span>
        </div>

        <div class="section">
          <div class="section-title">Order Information</div>
          <div class="info-grid">
            <div class="info-box">
              <div class="info-label">Order Date</div>
              <div class="info-value">${selectedOrder.date}</div>
            </div>
            <div class="info-box">
              <div class="info-label">Received Date</div>
              <div class="info-value">${selectedOrder.received || 'Not yet received'}</div>
            </div>
            <div class="info-box">
              <div class="info-label">Ordered By</div>
              <div class="info-value">Owner</div>
            </div>
            <div class="info-box">
              <div class="info-label">Total Quantity</div>
              <div class="info-value">${selectedOrder.quantity} items</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Store Information</div>
          <div class="info-grid">
            <div class="info-box">
              <div class="info-label">Source Store</div>
              <div class="info-value">${selectedOrder.fullSourceStore}</div>
            </div>
            <div class="info-box">
              <div class="info-label">Destination Store</div>
              <div class="info-value">${selectedOrder.fullDestinationStore}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Notes</div>
          <div class="info-box">
            <div class="info-value">${selectedOrder.notes || 'No notes provided'}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Items Details</div>
          <table>
            <thead>
              <tr>
                <th style="width: 50%;">Item Name</th>
                <th style="width: 30%;">SKU</th>
                <th style="width: 20%; text-align: right;">Quantity</th>
              </tr>
            </thead>
            <tbody>
              ${selectedOrder.items.map(item => `
                <tr>
                  <td>
                    <div class="item-name">${item.name}</div>
                  </td>
                  <td>
                    <div class="item-sku">${item.sku}</div>
                  </td>
                  <td style="text-align: right;">${item.quantity}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="2" style="text-align: right;">TOTAL QUANTITY:</td>
                <td style="text-align: right;">${selectedOrder.quantity}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="footer">
          <p>Generated on ${new Date().toLocaleString()}</p>
          <p>Transfer Order Management System</p>
        </div>
      </body>
      </html>
    `

    // Create a new window and print to PDF
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.onload = () => {
        printWindow.print()
      }
    }
    
    setShowMenu(false)
  }

  const downloadExcel = () => {
    if (!selectedOrder) return

    // Create workbook
    const wb = XLSX.utils.book_new()

    // Sheet 1: Order Summary
    const summaryData = [
      ['TRANSFER ORDER DETAILS'],
      [],
      ['Order ID:', selectedOrder.id],
      ['Status:', selectedOrder.status],
      ['Date:', selectedOrder.date],
      ['Received:', selectedOrder.received || 'Not yet received'],
      ['Ordered By:', 'Owner'],
      ['Total Quantity:', selectedOrder.quantity],
      [],
      ['SOURCE STORE'],
      [selectedOrder.fullSourceStore.replace(/\n/g, ', ')],
      [],
      ['DESTINATION STORE'],
      [selectedOrder.fullDestinationStore.replace(/\n/g, ', ')],
      [],
      ['NOTES'],
      [selectedOrder.notes],
      [],
      ['ITEMS'],
      ['Item Name', 'SKU', 'Quantity'],
      ...selectedOrder.items.map(item => [item.name, item.sku, item.quantity]),
      [],
      ['TOTAL', '', selectedOrder.quantity]
    ]

    const ws1 = XLSX.utils.aoa_to_sheet(summaryData)

    // Set column widths
    ws1['!cols'] = [
      { wch: 30 },
      { wch: 20 },
      { wch: 15 }
    ]

    // Style the header row
    if (ws1['A1']) {
      ws1['A1'].s = {
        font: { bold: true, sz: 16 },
        alignment: { horizontal: 'center' }
      }
    }

    XLSX.utils.book_append_sheet(wb, ws1, 'Order Summary')

    // Sheet 2: Items Only (for easy data analysis)
    const itemsData = [
      ['Transfer Order ID', 'Date', 'Status', 'Item Name', 'SKU', 'Quantity', 'Source Store', 'Destination Store'],
      ...selectedOrder.items.map(item => [
        selectedOrder.id,
        selectedOrder.date,
        selectedOrder.status,
        item.name,
        item.sku,
        item.quantity,
        selectedOrder.fullSourceStore.replace(/\n/g, ', '),
        selectedOrder.fullDestinationStore.replace(/\n/g, ', ')
      ])
    ]

    const ws2 = XLSX.utils.aoa_to_sheet(itemsData)
    ws2['!cols'] = [
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 30 },
      { wch: 15 },
      { wch: 10 },
      { wch: 25 },
      { wch: 25 }
    ]

    XLSX.utils.book_append_sheet(wb, ws2, 'Items List')

    // Generate Excel file
    XLSX.writeFile(wb, `${selectedOrder.id}_Transfer_Order.xlsx`)
    setShowMenu(false)
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchQuery === "" ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.sourceStore.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.destinationStore.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "All" || order.status === statusFilter
    const matchesSourceStore = sourceStoreFilter === "All stores" || order.sourceStore.includes(sourceStoreFilter)
    const matchesDestinationStore =
      destinationStoreFilter === "All stores" || order.destinationStore.includes(destinationStoreFilter)

    return matchesSearch && matchesStatus && matchesSourceStore && matchesDestinationStore
  })

  const ListView = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <button
              onClick={() => setView("create")}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <Plus size={20} />
              ADD TRANSFER ORDER
            </button>

            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Status</label>
                <select
                  className="border rounded px-3 py-1.5 text-sm w-32"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>All</option>
                  <option>In transit</option>
                  <option>Transferred</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Source store</label>
                <select
                  className="border rounded px-3 py-1.5 text-sm w-32"
                  value={sourceStoreFilter}
                  onChange={(e) => setSourceStoreFilter(e.target.value)}
                >
                  <option>All stores</option>
                  <option>new business</option>
                  <option>new store chawkhba...</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Destination store</label>
                <select
                  className="border rounded px-3 py-1.5 text-sm w-32"
                  value={destinationStoreFilter}
                  onChange={(e) => setDestinationStoreFilter(e.target.value)}
                >
                  <option>All stores</option>
                  <option>new business</option>
                  <option>new store chawkhba...</option>
                </select>
              </div>

              <div className="relative mt-5">
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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="px-3 py-2 pr-8 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-48"
                        autoFocus
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setShowSearch(false)
                        setSearchQuery('')
                      }}
                      className="p-2.5 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors"
                    >
                      <X size={18} className="text-gray-600" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Transfer order #</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Received</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Source store</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Destination store</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewDetail(order)}
                  >
                    <td className="px-6 py-4 text-sm text-blue-600">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.received || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.sourceStore}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.destinationStore}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`${order.status === "Transferred" ? "text-gray-600" : "text-orange-600"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.quantity}</td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No transfer orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 flex items-center justify-between border-t">
            <div className="flex items-center gap-2">
              <button className="p-2 border rounded hover:bg-gray-50">
                <ChevronLeft size={16} />
              </button>
              <button className="p-2 border rounded hover:bg-gray-50">
                <ChevronRight size={16} />
              </button>
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-gray-600">Page:</span>
                <input type="text" value="1" className="border rounded px-2 py-1 w-12 text-sm text-center" readOnly />
                <span className="text-sm text-gray-600">of 1</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <select className="border rounded px-2 py-1 text-sm">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const DetailView = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <button
              onClick={() => setView("list")}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <ChevronLeft size={20} />
              Transfer orders
            </button>

            <div className="flex items-center gap-2">
              {selectedOrder?.status === "In transit" && (
                <>
                  <button className="px-4 py-2 border rounded hover:bg-gray-50">RECEIVE</button>
                  <button onClick={handleEdit} className="px-4 py-2 border rounded hover:bg-gray-50">EDIT</button>
                </>
              )}
              <button className="px-4 py-2 border rounded hover:bg-gray-50">SEND</button>
              <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 border rounded hover:bg-gray-50"
                >
                  <MoreVertical size={20} />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                    <button
                      onClick={downloadPDF}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                    >
                      <Download size={16} />
                      Save as PDF
                    </button>
                    <button
                      onClick={downloadExcel}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 border-t text-sm"
                    >
                      <Download size={16} />
                      Save as Excel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h1 className="text-3xl font-semibold mb-2">{selectedOrder?.id}</h1>
            <p className="text-gray-600 mb-6">
              {selectedOrder?.status} ({selectedOrder?.date})
            </p>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-1">Date: {selectedOrder?.date}</p>
              <p className="text-sm text-gray-600">Ordered by: Owner</p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-sm font-semibold mb-2">Source store:</p>
                <p className="text-sm text-gray-700 whitespace-pre-line">{selectedOrder?.fullSourceStore}</p>
              </div>

              <div>
                <p className="text-sm font-semibold mb-2">Destination store:</p>
                <p className="text-sm text-gray-700 whitespace-pre-line">{selectedOrder?.fullDestinationStore}</p>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-sm font-semibold mb-2">Notes:</p>
              <p className="text-sm text-gray-700">{selectedOrder?.notes}</p>
            </div>

            {/* Items */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Items</h2>

              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 text-sm font-medium text-gray-600">Item</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-600">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder?.items.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-4">
                        <div className="text-sm text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">SKU {item.sku}</div>
                      </td>
                      <td className="text-right py-4 text-sm text-gray-900">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const EditView = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Edit Transfer Order: {editForm?.id}</h1>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Source store</label>
              <input
                type="text"
                value={editForm?.fullSourceStore || ''}
                onChange={(e) => setEditForm({ ...editForm!, fullSourceStore: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Destination store</label>
              <input
                type="text"
                value={editForm?.fullDestinationStore || ''}
                onChange={(e) => setEditForm({ ...editForm!, fullDestinationStore: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">Date of transfer order</label>
            <div className="relative">
              <input
                type="text"
                value={editForm?.date || ''}
                onChange={(e) => setEditForm({ ...editForm!, date: e.target.value })}
                className="w-full border rounded px-3 py-2 pr-10"
              />
              <Calendar className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">Status</label>
            <select
              value={editForm?.status || ''}
              onChange={(e) => setEditForm({ ...editForm!, status: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option>In transit</option>
              <option>Transferred</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">Notes</label>
            <textarea
              value={editForm?.notes || ''}
              onChange={(e) => setEditForm({ ...editForm!, notes: e.target.value })}
              className="w-full border rounded px-3 py-2 h-24 resize-none"
              placeholder="Add notes..."
            />
            <div className="text-right text-xs text-gray-500 mt-1">{editForm?.notes.length || 0} / 500</div>
          </div>

          {/* Items Section */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Items</h2>

            <table className="w-full mb-6">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Item</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-600">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {editForm?.items.map((item, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-4">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const newItems = [...editForm.items]
                          newItems[idx].name = e.target.value
                          setEditForm({ ...editForm, items: newItems })
                        }}
                        className="w-full border rounded px-3 py-1"
                      />
                      <input
                        type="text"
                        value={item.sku}
                        onChange={(e) => {
                          const newItems = [...editForm.items]
                          newItems[idx].sku = e.target.value
                          setEditForm({ ...editForm, items: newItems })
                        }}
                        className="w-full border rounded px-3 py-1 mt-2 text-sm"
                        placeholder="SKU"
                      />
                    </td>
                    <td className="text-right py-4">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const newItems = [...editForm.items]
                          newItems[idx].quantity = parseInt(e.target.value) || 0
                          const totalQty = newItems.reduce((sum, i) => sum + i.quantity, 0)
                          setEditForm({ ...editForm, items: newItems, quantity: totalQty })
                        }}
                        className="w-24 border rounded px-3 py-1 text-right ml-auto"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t">
            <button
              onClick={() => setView("detail")}
              className="px-6 py-2 border rounded hover:bg-gray-50"
            >
              CANCEL
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              SAVE CHANGES
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const CreateView = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Source store</label>
              <select className="w-full border rounded px-3 py-2">
                <option value="">Select source store</option>
                <option>new business</option>
                <option>new store chawkhbazar</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Destination store</label>
              <select className="w-full border rounded px-3 py-2">
                <option value="">Select destination store</option>
                <option>new business</option>
                <option>new store chawkhbazar</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">Date of transfer order</label>
            <div className="relative">
              <input type="text" value="Dec 28, 2025" className="w-full border rounded px-3 py-2 pr-10" readOnly />
              <Calendar className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">Notes</label>
            <textarea className="w-full border rounded px-3 py-2 h-24 resize-none" placeholder="Add notes..." />
            <div className="text-right text-xs text-gray-500 mt-1">0 / 500</div>
          </div>

          {/* Items Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Items</h2>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium">IMPORT</button>
            </div>

            <table className="w-full mb-6">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Item</th>
                  <th className="text-center py-3 text-sm font-medium text-gray-600">Source stock</th>
                  <th className="text-center py-3 text-sm font-medium text-gray-600">Destination stock</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-600">Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="py-8">
                    <input
                      type="text"
                      placeholder="Search item"
                      className="w-full border-0 text-gray-400 focus:outline-none"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t">
            <button onClick={() => setView("list")} className="px-6 py-2 border rounded hover:bg-gray-50">
              CANCEL
            </button>
            <button className="px-6 py-2 border rounded hover:bg-gray-50">SAVE AS DRAFT</button>
            <button className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600">CREATE</button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {view === "list" && <ListView />}
      {view === "detail" && <DetailView />}
      {view === "edit" && <EditView />}
      {view === "create" && <CreateView />}
    </>
  )
}

export default TransferOrders