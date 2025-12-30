"use client"

import type React from "react"
import { useState } from "react"
import { Plus, ChevronLeft, ChevronRight, Search, X, MoreVertical } from "lucide-react"

interface ProductionItem {
  name: string
  sku: string
  cost: number
  quantity: number
}

interface Production {
  id: string
  date: string
  store: string
  type: string
  quantity: number
  createdBy: string
  notes: string
  items: ProductionItem[]
}

interface CompositeItem {
  id: number
  name: string
  sku: string
  cost: number
}

interface FormData {
  store: string
  notes: string
  items: ProductionItem[]
}

// Main Productions Component
const Productions = () => {
  const [productions, setProductions] = useState<Production[]>([
    {
      id: "PR1001",
      date: "Dec 30, 2025",
      store: "bizflow",
      type: "Production",
      quantity: 4,
      createdBy: "Owner",
      notes: "new production notes",
      items: [{ name: "new items", sku: "10000", cost: 837.45, quantity: 4 }],
    },
    {
      id: "PR1002",
      date: "Dec 29, 2025",
      store: "store2",
      type: "Assembly",
      quantity: 10,
      createdBy: "Owner",
      notes: "Assembly notes",
      items: [{ name: "Widget A", sku: "10001", cost: 150.0, quantity: 10 }],
    },
    {
      id: "PR1003",
      date: "Dec 28, 2025",
      store: "bizflow",
      type: "Production",
      quantity: 7,
      createdBy: "Owner",
      notes: "Production batch 2",
      items: [{ name: "Component B", sku: "10002", cost: 320.5, quantity: 7 }],
    },
  ])
  const [showPopup, setShowPopup] = useState(false)
  const [selectedProduction, setSelectedProduction] = useState<Production | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "details">("list")

  const handleAddProduction = () => {
    setSelectedProduction(null)
    setShowPopup(true)
  }

  const handleRowClick = (production: Production) => {
    setSelectedProduction(production)
    setViewMode("details")
  }

  const handleBackToList = () => {
    setViewMode("list")
    setSelectedProduction(null)
  }

  const handleSaveProduction = (productionData: Omit<Production, "id">) => {
    if (selectedProduction) {
      setProductions(
        productions.map((p) => (p.id === selectedProduction.id ? { ...selectedProduction, ...productionData } : p)),
      )
    } else {
      const newId = `PR${String(productions.length + 1001)}`
      setProductions([...productions, { ...productionData, id: newId }])
    }
    setShowPopup(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {viewMode === "list" ? (
        <ProductionList productions={productions} onAddProduction={handleAddProduction} onRowClick={handleRowClick} />
      ) : (
        selectedProduction && <ProductionDetails production={selectedProduction} onBack={handleBackToList} />
      )}

      {showPopup && (
        <ProductionPopup
          production={selectedProduction}
          onClose={() => setShowPopup(false)}
          onSave={handleSaveProduction}
        />
      )}
    </div>
  )
}

// Production List Component
interface ProductionListProps {
  productions: Production[]
  onAddProduction: () => void
  onRowClick: (production: Production) => void
}

const ProductionList: React.FC<ProductionListProps> = ({ productions, onAddProduction, onRowClick }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [typeFilter, setTypeFilter] = useState("All types")
  const [storeFilter, setStoreFilter] = useState("All stores")
  const [searchTerm, setSearchTerm] = useState("")
  const [showSearch, setShowSearch] = useState(false)

  // Filter productions based on type, store, and search
  const filteredProductions = productions.filter((production) => {
    const matchesType = typeFilter === "All types" || production.type === typeFilter
    const matchesStore = storeFilter === "All stores" || production.store === storeFilter
    const matchesSearch =
      searchTerm === "" ||
      production.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      production.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
      production.type.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesType && matchesStore && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Add Production Button */}
            <div className="relative inline-block">
              <button
                onClick={onAddProduction}
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded flex items-center gap-2 text-sm font-semibold transition-colors w-full sm:w-auto justify-center"
              >
                <Plus size={18} />
                ADD PRODUCTION
                <ChevronLeft size={16} className="rotate-[-90deg]" />
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 sm:flex-none min-w-[140px]">
                <label className="block text-xs text-gray-600 mb-1.5">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option>All types</option>
                  <option>Production</option>
                  <option>Assembly</option>
                </select>
              </div>

              <div className="flex-1 sm:flex-none min-w-[140px]">
                <label className="block text-xs text-gray-600 mb-1.5">Store</label>
                <select
                  value={storeFilter}
                  onChange={(e) => setStoreFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option>All stores</option>
                  <option>bizflow</option>
                  <option>store2</option>
                </select>
              </div>

              {/* Search Button/Field */}
              {!showSearch ? (
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-2.5 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors mt-auto"
                >
                  <Search size={18} className="text-gray-600" />
                </button>
              ) : (
                <div className="flex items-center gap-2 mt-auto">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-48"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setShowSearch(false)
                      setSearchTerm("")
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
      </div>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-700">Production #</th>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-700">Store</th>
                  <th className="px-6 py-3.5 text-left text-sm font-medium text-gray-700">Type</th>
                  <th className="px-6 py-3.5 text-right text-sm font-medium text-gray-700">Quantity</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProductions.length > 0 ? (
                  filteredProductions.map((production) => (
                    <tr
                      key={production.id}
                      onClick={() => onRowClick(production)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{production.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{production.date}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{production.store}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{production.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap text-right">
                        {production.quantity}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                      No productions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-200">
            {filteredProductions.length > 0 ? (
              filteredProductions.map((production) => (
                <div
                  key={production.id}
                  onClick={() => onRowClick(production)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors active:bg-gray-100"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-semibold text-gray-900 text-base">{production.id}</span>
                    <span className="text-sm text-gray-600">{production.date}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Store:</span>
                      <span className="ml-2 text-gray-900">{production.store}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-500">Quantity:</span>
                      <span className="ml-2 text-gray-900">{production.quantity}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Type:</span>
                      <span className="ml-2 text-gray-900">{production.type}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-sm text-gray-500">No productions found</div>
            )}
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-200 bg-white px-4 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={18} className="text-gray-600" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                  disabled={currentPage === 1}
                >
                  <ChevronRight size={18} className="text-gray-600" />
                </button>
                <div className="flex items-center gap-2 text-sm text-gray-600 ml-2">
                  <span>Page:</span>
                  <input
                    type="text"
                    value={currentPage}
                    className="w-12 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    readOnly
                  />
                  <span>of 1</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Production Details Component
interface ProductionDetailsProps {
  production: Production
  onBack: () => void
}

const ProductionDetails: React.FC<ProductionDetailsProps> = ({ production, onBack }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded transition-colors">
              <ChevronLeft size={24} className="text-gray-600" />
            </button>
            <span className="text-sm text-gray-600">Productions</span>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded transition-colors">
            <MoreVertical size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Production ID */}
        <h1 className="text-3xl font-semibold mb-6">{production.id}</h1>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-600">Date:</span>
              <p className="text-base text-gray-900 mt-1">{production.date}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Created by:</span>
              <p className="text-base text-gray-900 mt-1">{production.createdBy}</p>
            </div>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-600">Store:</span>
            <p className="text-base text-gray-900 mt-1">{production.store}</p>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-8">
          <span className="text-sm font-medium text-gray-600">Notes:</span>
          <p className="text-base text-gray-900 mt-1">{production.notes}</p>
        </div>

        {/* Items Section */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold mb-4">Items</h2>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Item name</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Cost</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {production.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">SKU {item.sku}</div>
                    </td>
                    <td className="px-4 py-4 text-right text-sm text-gray-900">Tk{item.cost.toFixed(2)}</td>
                    <td className="px-4 py-4 text-right text-sm text-gray-900">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {production.items.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="font-medium text-gray-900 mb-1">{item.name}</div>
                <div className="text-xs text-gray-500 mb-3">SKU {item.sku}</div>
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="text-gray-600">Cost:</span>
                    <span className="ml-2 text-gray-900">Tk{item.cost.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Quantity:</span>
                    <span className="ml-2 text-gray-900">{item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Production Popup Component
interface ProductionPopupProps {
  production: Production | null
  onClose: () => void
  onSave: (data: Omit<Production, "id">) => void
}

const ProductionPopup: React.FC<ProductionPopupProps> = ({ production, onClose, onSave }) => {
  const [formData, setFormData] = useState<FormData>({
    store: production?.store || "",
    notes: production?.notes || "",
    items: production?.items || [],
  })

  // Demo composite items for search
  const [compositeItems] = useState<CompositeItem[]>([
    { id: 1, name: 'Laptop Pro 15"', sku: "20001", cost: 1200.0 },
    { id: 2, name: "Wireless Mouse", sku: "20002", cost: 45.5 },
    { id: 3, name: "Mechanical Keyboard", sku: "20003", cost: 125.0 },
    { id: 4, name: "USB-C Hub", sku: "20004", cost: 89.99 },
    { id: 5, name: "Monitor Stand", sku: "20005", cost: 65.0 },
    { id: 6, name: "Webcam HD", sku: "20006", cost: 95.0 },
    { id: 7, name: "Headphone Stand", sku: "20007", cost: 35.0 },
    { id: 8, name: "Desk Lamp LED", sku: "20008", cost: 55.0 },
  ])

  const [itemSearch, setItemSearch] = useState("")
  const [showItemResults, setShowItemResults] = useState(false)

  // Filter items based on search
  const filteredItems = compositeItems.filter(
    (item) => item.name.toLowerCase().includes(itemSearch.toLowerCase()) || item.sku.includes(itemSearch),
  )

  const handleAddItem = (item: CompositeItem) => {
    const existingItem = formData.items.find((i) => i.sku === item.sku)
    if (existingItem) {
      setFormData({
        ...formData,
        items: formData.items.map((i) => (i.sku === item.sku ? { ...i, quantity: i.quantity + 1 } : i)),
      })
    } else {
      setFormData({
        ...formData,
        items: [...formData.items, { ...item, quantity: 1 }],
      })
    }
    setItemSearch("")
    setShowItemResults(false)
  }

  const handleRemoveItem = (sku: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter((item) => item.sku !== sku),
    })
  }

  const handleQuantityChange = (sku: string, quantity: string) => {
    const qty = Number.parseInt(quantity) || 0
    setFormData({
      ...formData,
      items: formData.items.map((item) => (item.sku === sku ? { ...item, quantity: qty } : item)),
    })
  }

  const handleSave = () => {
    onSave({
      ...formData,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      type: "Production",
      quantity: formData.items.reduce((sum, item) => sum + (item.quantity || 0), 0),
      createdBy: "Owner",
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Store Dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Store</label>
            <select
              value={formData.store}
              onChange={(e) => setFormData({ ...formData, store: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select store</option>
              <option value="bizflow">bizflow</option>
              <option value="store2">Store 2</option>
            </select>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add notes..."
              maxLength={500}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
            <div className="text-right text-xs text-gray-500 mt-1">{formData.notes.length} / 500</div>
          </div>

          {/* Items Section */}
          <div className="mb-6">
            <h3 className="text-base font-semibold mb-4">Items</h3>

            {/* Search Composite Item */}
            <div className="relative mb-4">
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <input
                  type="text"
                  value={itemSearch}
                  onChange={(e) => {
                    setItemSearch(e.target.value)
                    setShowItemResults(true)
                  }}
                  onFocus={() => setShowItemResults(true)}
                  placeholder="Search composite item"
                  className="w-full px-4 py-3 focus:outline-none"
                />
              </div>

              {/* Search Results Dropdown */}
              {showItemResults && itemSearch && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleAddItem(item)}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">
                          SKU: {item.sku} • Tk{item.cost.toFixed(2)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500 text-sm">No items found</div>
                  )}
                </div>
              )}
            </div>

            {/* Added Items */}
            {formData.items.length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Item</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Cost</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Quantity</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-500">SKU {item.sku}</div>
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-gray-900">Tk{item.cost.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.sku, e.target.value)}
                              min="1"
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleRemoveItem(item.sku)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-200">
                  {formData.items.map((item, index) => (
                    <div key={index} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-xs text-gray-500">SKU {item.sku}</div>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.sku)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-900">Tk{item.cost.toFixed(2)}</span>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.sku, e.target.value)}
                          min="1"
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-right focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              CANCEL
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors font-medium"
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Productions
