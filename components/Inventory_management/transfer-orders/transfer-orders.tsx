


"use client"
import { useState } from "react"
import { ChevronLeft, ChevronRight, Search, Calendar, Plus, MoreVertical } from "lucide-react"

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
  const [view, setView] = useState<"list" | "detail" | "create">("list")
  const [selectedOrder, setSelectedOrder] = useState<TransferOrder | null>(null) // Added explicit type
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [sourceStoreFilter, setSourceStoreFilter] = useState("All stores")
  const [destinationStoreFilter, setDestinationStoreFilter] = useState("All stores")

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
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border rounded pl-8 pr-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-2 top-2 text-gray-400" size={16} />
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
                  <button className="px-4 py-2 border rounded hover:bg-gray-50">EDIT</button>
                </>
              )}
              <button className="px-4 py-2 border rounded hover:bg-gray-50">SEND</button>
              <button className="p-2 border rounded hover:bg-gray-50">
                <MoreVertical size={20} />
              </button>
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
      {view === "create" && <CreateView />}
    </>
  )
}

export default TransferOrders

