'use client'
import React, { useState, useEffect } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Search,
  Plus,
  X,
  Trash2,
} from 'lucide-react'
import Barcode from 'react-barcode'
import { useItems, useCreateItem, useEditItem, useDeleteItem } from '@/hooks/use-items'
import { useCategories } from '@/hooks/use-categories'
import { GetItem, ItemComponent } from '@/types/items'

interface Variant {
  name: string
  values: string[]
}

interface FormData {
  name: string
  categoryId: string
  description: string
  availableForSale: boolean
  soldBy: string
  price: string
  cost: string
  margin: string
  sku: string
  barcode: string
  compositeItem: boolean
  trackStock: boolean
  inStock: string
  lowStock: string
  color: string
  shape: string
  primarySupplier: string
  imageUrl: string
  components: ItemComponent[]
}

const InventoryManagement: React.FC = () => {
  // DATA FETCHING
  const { data: items = [], isLoading: itemsLoading } = useItems()
  console.log("items data:", items)
  const { data: categoriesData = [], isLoading: categoriesLoading } = useCategories()
  const deleteItemMutation = useDeleteItem()

  // STATE
  const [showModal, setShowModal] = useState(false)
  const [showVariantModal, setShowVariantModal] = useState(false)
  const [currentItem, setCurrentItem] = useState<GetItem | null>(null)
  const [categoryFilter, setCategoryFilter] = useState('All items')
  const [stockFilter, setStockFilter] = useState('All items')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
  const [variants, setVariants] = useState<Variant[]>([])
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  const [formData, setFormData] = useState<FormData>({
    name: '',
    categoryId: '',
    description: '',
    availableForSale: true,
    soldBy: 'Each',
    price: '',
    cost: '',
    margin: '',
    sku: '',
    barcode: '',
    compositeItem: false,
    trackStock: false,
    inStock: '0',
    lowStock: '',
    color: '#FFFFFF',
    shape: 'check',
    primarySupplier: '',
    imageUrl: '',
    components: [],
  })

  const colors = [
    '#FFFFFF',
    '#EF4444',
    '#EC4899',
    '#F59E0B',
    '#EAB308',
    '#22C55E',
    '#3B82F6',
    '#A855F7',
  ]
  const shapes = ['check', 'circle', 'dashed-circle', 'hexagon']

  // RESET FORM
  const resetForm = () => {
    setFormData({
      name: '',
      categoryId: '',
      description: '',
      availableForSale: true,
      soldBy: 'Each',
      price: '',
      cost: '',
      margin: '',
      sku: '',
      barcode: '',
      compositeItem: false,
      trackStock: false,
      inStock: '0',
      lowStock: '',
      color: '#FFFFFF',
      shape: 'check',
      primarySupplier: '',
      imageUrl: '',
      components: [],
    })
  }

  // MUTATIONS
  const createMutation = useCreateItem({
    onClose: () => setShowModal(false),
    reset: resetForm,
  })

  const editMutation = useEditItem({
    onClose: () => setShowModal(false),
    reset: resetForm,
  })

  // FILTERING
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesCategory =
      categoryFilter === 'All items' || item.categoryName === categoryFilter
    const matchesStock =
      stockFilter === 'All items' ||
      (stockFilter === 'Low stock' && item.inStock !== null && item.inStock < (item.lowStock || 10)) ||
      (stockFilter === 'Out stock' && item.inStock === 0)
    return matchesSearch && matchesCategory && matchesStock
  })

  // SELECTION HANDLERS
  const toggleItemSelection = (id: number) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) newSelected.delete(id)
    else newSelected.add(id)
    setSelectedItems(newSelected)
  }

  const toggleAllItems = () => {
    if (selectedItems.size === filteredItems.length) setSelectedItems(new Set())
    else setSelectedItems(new Set(filteredItems.map((item) => item.itemId)))
  }

  const deleteSelectedItems = () => {
    if (selectedItems.size === 0) return
    if (!confirm(`Delete ${selectedItems.size} item(s)?`)) return
    
    selectedItems.forEach((id) => {
      deleteItemMutation.mutate(id)
    })
    setSelectedItems(new Set())
  }

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) newExpanded.delete(id)
    else newExpanded.add(id)
    setExpandedItems(newExpanded)
  }

  // MODAL HANDLERS
  const openModal = (item: GetItem | null = null) => {
    if (item) {
      // EDIT MODE - populate form with existing item data
      setCurrentItem(item)
      
      // Parse components if exists
      let parsedComponents: ItemComponent[] = []
      if (item.components) {
        try {
          parsedComponents = JSON.parse(item.components)
        } catch (e) {
          console.error('Failed to parse components:', e)
        }
      }

      setFormData({
        name: item.name || '',
        categoryId: String(item.categoryId) || '',
        description: item.description || '',
        availableForSale: item.availableForSale ?? true,
        soldBy: item.soldBy || 'Each',
        price: item.price || '',
        cost: item.cost || '',
        margin: item.margin || '',
        sku: item.sku || '',
        barcode: item.barcode || '',
        compositeItem: item.compositeItem ?? false,
        trackStock: item.trackStock ?? false,
        inStock: String(item.inStock || 0),
        lowStock: String(item.lowStock || ''),
        color: item.color || '#FFFFFF',
        shape: item.shape || 'check',
        primarySupplier: item.primarySupplier || '',
        imageUrl: item.imageUrl || '',
        components: parsedComponents,
      })
    } else {
      // CREATE MODE - reset form
      setCurrentItem(null)
      resetForm()
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setCurrentItem(null)
    resetForm()
  }

  const handleSave = () => {
    // Validation
    if (!formData.name.trim()) {
      alert('Item name is required')
      return
    }
    if (!formData.categoryId) {
      alert('Category is required')
      return
    }

    // Prepare payload
    const payload: any = {
      name: formData.name.trim(),
      categoryId: Number(formData.categoryId),
      description: formData.description || null,
      availableForSale: formData.availableForSale,
      soldBy: formData.soldBy,
      price: formData.price || null,
      cost: formData.cost || null,
      margin: formData.margin || null,
      sku: formData.sku || null,
      barcode: formData.barcode || null,
      compositeItem: formData.compositeItem,
      trackStock: formData.trackStock,
      inStock: Number(formData.inStock) || 0,
      lowStock: formData.lowStock ? Number(formData.lowStock) : null,
      color: formData.color,
      shape: formData.shape,
      primarySupplier: formData.primarySupplier || null,
      imageUrl: formData.imageUrl || null,
    }

    // Add components as JSON string if composite item
    if (formData.compositeItem && formData.components.length > 0) {
      payload.components = JSON.stringify(formData.components)
    }

    if (currentItem) {
      // EDIT
      editMutation.mutate({
        id: currentItem.itemId,
        data: payload,
      })
    } else {
      // CREATE
      createMutation.mutate(payload)
    }
  }

  // COMPONENT HANDLERS
  const addComponent = () => {
    setFormData({
      ...formData,
      components: [
        ...formData.components,
        { name: '', quantity: '', cost: '' },
      ],
    })
  }

  const updateComponent = (index: number, field: keyof ItemComponent, value: string) => {
    const newComponents = [...formData.components]
    newComponents[index] = { ...newComponents[index], [field]: value }
    setFormData({ ...formData, components: newComponents })
  }

  const removeComponent = (index: number) => {
    setFormData({
      ...formData,
      components: formData.components.filter((_, i) => i !== index),
    })
  }

  const getTotalCost = () => {
    return formData.components
      .reduce((sum, comp) => sum + (parseFloat(String(comp.cost)) || 0), 0)
      .toFixed(2)
  }

  // VARIANT HANDLERS
  const openVariantModal = () => {
    setVariants([{ name: '', values: [] }])
    setShowVariantModal(true)
  }

  const closeVariantModal = () => {
    setShowVariantModal(false)
    setVariants([])
  }

  const addVariant = () => setVariants([...variants, { name: '', values: [] }])

  const updateVariantName = (index: number, name: string) => {
    const newVariants = [...variants]
    newVariants[index].name = name
    setVariants(newVariants)
  }

  const addVariantValue = (index: number, value: string) => {
    const newVariants = [...variants]
    newVariants[index].values.push(value)
    setVariants(newVariants)
  }

  const removeVariantValue = (variantIndex: number, valueIndex: number) => {
    const newVariants = [...variants]
    newVariants[variantIndex].values.splice(valueIndex, 1)
    setVariants(newVariants)
  }

  const removeVariant = (index: number) =>
    setVariants(variants.filter((_, i) => i !== index))

  // IMPORT/EXPORT HANDLERS
  const exportToCSV = () => {
    const headers = [
      'Item Name',
      'Category',
      'Price',
      'Cost',
      'Margin',
      'In Stock',
      'SKU',
      'Barcode',
    ]
    const rows = filteredItems.map((item) => [
      item.name,
      item.categoryName || '',
      item.price || '',
      item.cost || '',
      item.margin || '',
      item.inStock || 0,
      item.sku || '',
      item.barcode || '',
    ])

    let csvContent = headers.join(',') + '\n'
    rows.forEach((row) => {
      csvContent += row.map(val => `"${val}"`).join(',') + '\n'
    })

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `inventory_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    alert('Import feature: Parse CSV and call createMutation.mutate() for each valid row')
    event.target.value = ''
  }

  // MAIN RENDER
  if (itemsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading items...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-6">
      {/* HEADER SECTION */}
      <div className="bg-white border-b">
        <div className="p-3 md:p-4">
          {/* Mobile Layout */}
          <div className="md:hidden space-y-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => openModal()}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded flex items-center gap-2 font-medium text-sm flex-1"
              >
                <Plus size={16} /> ADD ITEM
              </button>

              {selectedItems.size > 0 ? (
                <button
                  onClick={deleteSelectedItems}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded flex items-center gap-2 font-medium text-sm flex-1"
                >
                  <Trash2 size={16} /> DELETE ({selectedItems.size})
                </button>
              ) : (
                <>
                  <label className="text-gray-700 font-medium px-3 py-2 hover:bg-gray-100 rounded cursor-pointer text-sm border whitespace-nowrap">
                    IMPORT
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={exportToCSV}
                    className="text-gray-700 font-medium px-3 py-2 hover:bg-gray-100 rounded text-sm border whitespace-nowrap"
                  >
                    EXPORT
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!showSearch ? (
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-2.5 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors"
                >
                  <Search size={18} className="text-gray-600" />
                </button>
              ) : (
                <div className="flex items-center gap-2 flex-1">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search items..."
                      className="px-3 py-2 pr-8 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
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

              {!showSearch && (
                <>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="border rounded px-2 py-2 text-sm bg-white flex-1"
                  >
                    <option>All items</option>
                    {categoriesData?.map((cat) => (
                      <option key={cat.categoryId}>{cat.name}</option>
                    ))}
                  </select>

                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="border rounded px-2 py-2 text-sm bg-white"
                  >
                    <option>All items</option>
                    <option>Low stock</option>
                    <option>Out stock</option>
                  </select>
                </>
              )}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => openModal()}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 font-medium"
              >
                <Plus size={18} /> ADD ITEM
              </button>

              {selectedItems.size > 0 ? (
                <button
                  onClick={deleteSelectedItems}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 font-medium"
                >
                  <Trash2 size={18} /> DELETE ({selectedItems.size})
                </button>
              ) : (
                <>
                  <label className="text-gray-700 font-medium px-4 py-2 hover:bg-gray-100 rounded cursor-pointer">
                    IMPORT
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={exportToCSV}
                    className="text-gray-700 font-medium px-4 py-2 hover:bg-gray-100 rounded"
                  >
                    EXPORT
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="border rounded px-3 py-1.5 text-sm bg-white min-w-[150px]"
                >
                  <option>All items</option>
                  {categoriesData?.map((category) => (
                    <option key={category.categoryId}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Stock alert</label>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="border rounded px-3 py-1.5 text-sm bg-white min-w-[150px]"
                >
                  <option>All items</option>
                  <option>Low stock</option>
                  <option>Out stock</option>
                </select>
              </div>

              {!showSearch ? (
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-2.5 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors"
                >
                  <Search size={18} className="text-gray-600" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="px-3 py-2 pr-8 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-48"
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
      </div>

      {/* TABLE - DESKTOP */}
      <div className="hidden md:block bg-white m-4 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={
                    selectedItems.size === filteredItems.length &&
                    filteredItems.length > 0
                  }
                  onChange={toggleAllItems}
                />
              </th>
              <th className="text-center p-4 text-sm font-medium text-gray-700">
                Item name ↑
              </th>
              <th className="text-center p-4 text-sm font-medium text-gray-700">
                Category
              </th>
              <th className="text-center p-4 text-sm font-medium text-gray-700">
                Price
              </th>
              <th className="text-center p-4 text-sm font-medium text-gray-700">
                Cost
              </th>
              <th className="text-center p-4 text-sm font-medium text-gray-700">
                Margin
              </th>
              <th className="text-center p-4 text-sm font-medium text-gray-700">
                In stock
              </th>
              <th className="text-center p-4 text-sm font-medium text-gray-700">
                Barcode
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-500">
                  No items found. Click ADD ITEM to create your first item.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.itemId} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={selectedItems.has(item.itemId)}
                      onChange={() => toggleItemSelection(item.itemId)}
                    />
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => openModal(item)}
                      className="text-blue-600 hover:underline"
                    >
                      {item.name}
                    </button>
                  </td>
                  <td className="p-4 text-gray-700 text-center">
                    {item.categoryName || '-'}
                  </td>
                  <td className="p-4 text-gray-700 text-center">
                    {item.price ? `Tk${item.price}` : '-'}
                  </td>
                  <td className="p-4 text-gray-700 text-center">
                    {item.cost ? `Tk${item.cost}` : '-'}
                  </td>
                  <td className="p-4 text-gray-700 text-center">{item.margin || '-'}</td>
                  <td className="p-4 text-gray-700 text-center">
                    {item.inStock?.toLocaleString() || 0}
                  </td>
                  <td className="p-4 text-center">
                    {item.barcode ? (
                      <div className="flex flex-col items-center">
                        <Barcode
                          value={String(item.barcode)}
                          width={1.2}
                          height={40}
                          fontSize={12}
                          displayValue={true}
                        />
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CARD VIEW - MOBILE */}
      <div className="md:hidden p-4 space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center text-gray-500">
            No items found. Click ADD ITEM to create your first item.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.itemId}
              className="bg-white rounded-lg border shadow-sm p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mt-1"
                    checked={selectedItems.has(item.itemId)}
                    onChange={() => toggleItemSelection(item.itemId)}
                  />
                  <div className="flex-1">
                    <button
                      onClick={() => openModal(item)}
                      className="text-blue-600 hover:underline font-medium text-left"
                    >
                      {item.name}
                    </button>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.categoryName || 'No category'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Price:</span>
                  <span className="ml-2 font-medium">
                    {item.price ? `Tk${item.price}` : '-'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Cost:</span>
                  <span className="ml-2 font-medium">
                    {item.cost ? `Tk${item.cost}` : '-'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Margin:</span>
                  <span className="ml-2 font-medium">{item.margin || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-600">In Stock:</span>
                  <span className="ml-2 font-medium">
                    {item.inStock?.toLocaleString() || 0}
                  </span>
                </div>
              </div>

              {item.barcode && (
                <div className="mt-3 pt-3 border-t flex justify-center">
                  <Barcode
                    value={String(item.barcode)}
                    width={1}
                    height={30}
                    fontSize={10}
                    displayValue={true}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ADD/EDIT ITEM MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {currentItem ? 'Edit Item' : 'Add New Item'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter item name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select category</option>
                    {categoriesData?.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                    placeholder="Enter item description"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost
                  </label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) =>
                      setFormData({ ...formData, cost: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Margin
                  </label>
                  <input
                    type="text"
                    value={formData.margin}
                    onChange={(e) =>
                      setFormData({ ...formData, margin: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0%"
                  />
                </div>
              </div>

              {/* SKU & Barcode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter SKU"
                  />
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Barcode
                  </label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) =>
                      setFormData({ ...formData, barcode: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter barcode"
                  />
                </div> */}
              </div>

              {/* Stock Management */}
              <div>
                <label className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    checked={formData.trackStock}
                    onChange={(e) =>
                      setFormData({ ...formData, trackStock: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Track Stock
                  </span>
                </label>

                {formData.trackStock && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        In Stock
                      </label>
                      <input
                        type="number"
                        value={formData.inStock}
                        onChange={(e) =>
                          setFormData({ ...formData, inStock: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Low Stock Alert
                      </label>
                      <input
                        type="number"
                        value={formData.lowStock}
                        onChange={(e) =>
                          setFormData({ ...formData, lowStock: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="10"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Composite Item */}
              <div>
                <label className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    checked={formData.compositeItem}
                    onChange={(e) =>
                      setFormData({ ...formData, compositeItem: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Composite Item
                  </span>
                </label>

                {formData.compositeItem && (
                  <div className="space-y-3">
                    {formData.components.map((comp, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={comp.name}
                          onChange={(e) =>
                            updateComponent(index, 'name', e.target.value)
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Component name"
                        />
                        <input
                          type="number"
                          value={comp.quantity}
                          onChange={(e) =>
                            updateComponent(index, 'quantity', e.target.value)
                          }
                          className="w-24 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Qty"
                        />
                        <input
                          type="number"
                          value={comp.cost}
                          onChange={(e) =>
                            updateComponent(index, 'cost', e.target.value)
                          }
                          className="w-28 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Cost"
                        />
                        <button
                          onClick={() => removeComponent(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={addComponent}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      + Add Component
                    </button>

                    {formData.components.length > 0 && (
                      <div className="text-sm text-gray-600 mt-2">
                        Total Cost: Tk{getTotalCost()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={createMutation.isPending || editMutation.isPending}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded font-medium disabled:opacity-50"
              >
                {createMutation.isPending || editMutation.isPending
                  ? 'Saving...'
                  : currentItem
                  ? 'Update Item'
                  : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InventoryManagement





// 'use client'
// import React, { useState } from 'react'
// import {
//   ChevronDown,
//   ChevronRight,
//   Search,
//   Plus,
//   X,
//   Trash2,
  
// } from 'lucide-react'
// import Barcode from 'react-barcode'
// import { useItems } from '@/hooks/use-items'
// import { useCategories } from '@/hooks/use-categories'
// import { GetItem } from '@/types/items'

// interface Variant {
//   name: string
//   values: string[]
// }

// interface FormData {
//   name: string
//   category: string
//   description: string
//   availableForSale: boolean
//   soldBy: string
//   price: string
//   cost: string
//   sku: string
//   barcode: string
//   compositeItem: boolean
//   trackStock: boolean
//   inStock: string
//   lowStock: string
//   color: string
//   shape: string
//   components: { name: string; quantity: string; cost: string }[]
// }

// interface Item {
//   itemId: number
//   name: string
//   categoryName: string
//   price: string
//   cost: string
//   margin: string
//   inStock: number
//   expanded?: boolean
//   variantSku?: Item[]
// }

// const InventoryManagement: React.FC = () => {
//   const { data: item } = useItems()
//   console.log('this is items data', item)
//   const { data: categoriesData, isLoading, error } = useCategories()

//   const [items, setItems] = useState<Item[]>([
//     {
//       itemId: 1,
//       name: 'Laptop Stand',
//       categoryName: 'Electronics',
//       price: '1500',
//       cost: '1000',
//       margin: '33.3%',
//       inStock: 45,
//       expanded: false,
//     },
//     {
//       itemId: 2,
//       name: 'Wireless Mouse',
//       categoryName: 'Electronics',
//       price: '800',
//       cost: '500',
//       margin: '37.5%',
//       inStock: 120,
//       expanded: false,
//     },
//     {
//       itemId: 3,
//       name: 'Office Chair',
//       categoryName: 'Furniture',
//       price: '5500',
//       cost: '3500',
//       margin: '36.4%',
//       inStock: 15,
//       expanded: false,
//     },
//   ])
//   console.log('demo data: ', items)

//   const [showModal, setShowModal] = useState(false)
//   const [showVariantModal, setShowVariantModal] = useState(false)
//   const [currentItem, setCurrentItem] = useState<Item | null>(null)
//   const [categoryFilter, setCategoryFilter] = useState('All items')
//   const [stockFilter, setStockFilter] = useState('All items')
//   const [searchQuery, setSearchQuery] = useState('')
//   const [showSearch, setShowSearch] = useState(false)
//   const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
//   const [variants, setVariants] = useState<Variant[]>([])

//   const [formData, setFormData] = useState<FormData>({
//     name: '',
//     category: 'No category',
//     description: '',
//     availableForSale: true,
//     soldBy: 'Each',
//     price: '',
//     cost: '',
//     sku: '',
//     barcode: '',
//     compositeItem: false,
//     trackStock: false,
//     inStock: '0',
//     lowStock: '',
//     color: '#FFFFFF',
//     shape: 'check',
//     components: [],
//   })

//   const colors = [
//     '#FFFFFF',
//     '#EF4444',
//     '#EC4899',
//     '#F59E0B',
//     '#EAB308',
//     '#22C55E',
//     '#3B82F6',
//     '#A855F7',
//   ]
//   const shapes = ['check', 'circle', 'dashed-circle', 'hexagon']

//   // const uniqueCategories = ['Electronics', 'Furniture', 'Office Supplies']

//   const filteredItems = items.filter((item) => {
//     const matchesSearch = item.name
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase())
//     const matchesCategory =
//       categoryFilter === 'All items' || item.categoryName === categoryFilter
//     return matchesSearch && matchesCategory
//   })

//   const toggleItemSelection = (id: number) => {
//     const newSelected = new Set(selectedItems)
//     if (newSelected.has(id)) newSelected.delete(id)
//     else newSelected.add(id)
//     setSelectedItems(newSelected)
//   }

//   const toggleAllItems = () => {
//     if (selectedItems.size === filteredItems.length) setSelectedItems(new Set())
//     else setSelectedItems(new Set(filteredItems.map((item) => item.itemId)))
//   }

//   const deleteSelectedItems = () => {
//     items.filter((item) => !selectedItems.has(item.itemId))
//     setSelectedItems(new Set())
//   }

//   const openModal = (item: Item | null = null) => {
//     if (item) {
//       setCurrentItem(item)
//       setFormData({
//         ...formData,
//         name: item.name,
//         category: item.categoryName || 'No category',
//         price: item.price || '',
//         cost: item.cost || '',
//         inStock: item.inStock?.toString() || '0',
//       })
//     } else {
//       setCurrentItem(null)
//       setFormData({
//         name: '',
//         category: 'No category',
//         description: '',
//         availableForSale: true,
//         soldBy: 'Each',
//         price: '',
//         cost: '',
//         sku: '10001',
//         barcode: '',
//         compositeItem: false,
//         trackStock: false,
//         inStock: '0',
//         lowStock: '',
//         color: '#FFFFFF',
//         shape: 'check',
//         components: [],
//       })
//     }
//     setShowModal(true)
//   }

//   const closeModal = () => {
//     setShowModal(false)
//     setCurrentItem(null)
//   }

//   const handleSave = () => {
//     if (currentItem) {
//       setItems(
//         items.map((item) =>
//           item.itemId === currentItem.itemId
//             ? {
//                 ...item,
//                 name: formData.name,
//                 categoryName: formData.category,
//                 price: formData.price,
//                 cost: formData.cost,
//                 inStock: parseInt(formData.inStock) || 0,
//               }
//             : item
//         )
//       )
//     } else {
//       const maxId =
//         items.length > 0 ? Math.max(...items.map((i) => i.itemId)) : 0
//       const newItem: Item = {
//         itemId: maxId + 1,
//         name: formData.name || 'New item',
//         categoryName: formData.category,
//         price: formData.price,
//         cost: formData.cost,
//         margin: '',
//         inStock: parseInt(formData.inStock) || 0,
//         expanded: false,
//       }
//       setItems([...items, newItem])
//     }
//     closeModal()
//   }

//   const toggleExpand = (id: number) => {
//     setItems(
//       items.map((item) =>
//         item.itemId === id ? { ...item, expanded: !item.expanded } : item
//       )
//     )
//   }

//   const openVariantModal = () => {
//     setVariants([{ name: '', values: [] }])
//     setShowVariantModal(true)
//   }

//   const closeVariantModal = () => {
//     setShowVariantModal(false)
//     setVariants([])
//   }

//   const addVariant = () => setVariants([...variants, { name: '', values: [] }])

//   const updateVariantName = (index: number, name: string) => {
//     const newVariants = [...variants]
//     newVariants[index].name = name
//     setVariants(newVariants)
//   }

//   const addVariantValue = (index: number, value: string) => {
//     const newVariants = [...variants]
//     newVariants[index].values.push(value)
//     setVariants(newVariants)
//   }

//   const removeVariantValue = (variantIndex: number, valueIndex: number) => {
//     const newVariants = [...variants]
//     newVariants[variantIndex].values.splice(valueIndex, 1)
//     setVariants(newVariants)
//   }

//   const removeVariant = (index: number) =>
//     setVariants(variants.filter((_, i) => i !== index))

//   const addComponent = () => {
//     setFormData({
//       ...formData,
//       components: [
//         ...formData.components,
//         { name: '', quantity: '', cost: '' },
//       ],
//     })
//   }

//   const updateComponent = (index: number, field: string, value: string) => {
//     const newComponents = [...formData.components]
//     newComponents[index] = { ...newComponents[index], [field]: value }
//     setFormData({ ...formData, components: newComponents })
//   }

//   const removeComponent = (index: number) => {
//     setFormData({
//       ...formData,
//       components: formData.components.filter((_, i) => i !== index),
//     })
//   }

//   const getTotalCost = () => {
//     return formData.components
//       .reduce((sum, comp) => sum + (parseFloat(comp.cost) || 0), 0)
//       .toFixed(2)
//   }

//   const exportToCSV = () => {
//     const headers = [
//       'Item Name',
//       'Category',
//       'Price',
//       'Cost',
//       'Margin',
//       'In Stock',
//     ]
//     const rows = items.map((item) => [
//       item.name,
//       item.categoryName || '',
//       item.price,
//       item.cost,
//       item.margin,
//       item.inStock,
//     ])

//     let csvContent = headers.join(',') + '\n'
//     rows.forEach((row) => {
//       csvContent += row.join(',') + '\n'
//     })

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
//     const link = document.createElement('a')
//     const url = URL.createObjectURL(blob)
//     link.setAttribute('href', url)
//     link.setAttribute('download', 'inventory_export.csv')
//     link.style.visibility = 'hidden'
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//   }

//   const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0]
//     if (!file) return

//     const reader = new FileReader()
//     reader.onload = (e) => {
//       const text = e.target?.result as string
//       const lines = text.split('\n')
//       const newItems: Item[] = []

//       for (let i = 1; i < lines.length; i++) {
//         const line = lines[i].trim()
//         if (!line) continue

//         const values = line.split(',')
//         if (values.length >= 6) {
//           const maxId = Math.max(
//             ...items.map((i) => i.itemId),
//             ...newItems.map((i) => i.itemId)
//           )
//           newItems.push({
//             itemId: maxId + newItems.length + 1,
//             name: values[0] || 'Imported item',
//             categoryName: values[1] || 'No category',
//             price: values[2] || '0',
//             cost: values[3] || '0',
//             margin: values[4] || '',
//             inStock: parseInt(values[5]) || 0,
//             expanded: false,
//           })
//         }
//       }

//       if (newItems.length > 0) {
//         setItems([...items, ...newItems])
//         alert(`Successfully imported ${newItems.length} items`)
//       }
//     }
//     reader.readAsText(file)
//     event.target.value = ''
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 mt-6">
//       <div className="bg-white border-b">
//         <div className="p-3 md:p-4">
//           {/* Mobile Layout */}
//           <div className="md:hidden space-y-3">
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => openModal()}
//                 className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded flex items-center gap-2 font-medium text-sm flex-1"
//               >
//                 <Plus size={16} /> ADD ITEM
//               </button>

//               {selectedItems.size > 0 ? (
//                 <button
//                   onClick={deleteSelectedItems}
//                   className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded flex items-center gap-2 font-medium text-sm flex-1"
//                 >
//                   <Trash2 size={16} /> DELETE ({selectedItems.size})
//                 </button>
//               ) : (
//                 <>
//                   <label className="text-gray-700 font-medium px-3 py-2 hover:bg-gray-100 rounded cursor-pointer text-sm border whitespace-nowrap">
//                     IMPORT
//                     <input
//                       type="file"
//                       accept=".csv"
//                       onChange={handleImport}
//                       className="hidden"
//                     />
//                   </label>
//                   <button
//                     onClick={exportToCSV}
//                     className="text-gray-700 font-medium px-3 py-2 hover:bg-gray-100 rounded text-sm border whitespace-nowrap"
//                   >
//                     EXPORT
//                   </button>
//                 </>
//               )}
//             </div>

//             <div className="flex items-center gap-2">
//               {!showSearch ? (
//                 <button
//                   onClick={() => setShowSearch(true)}
//                   className="p-2.5 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors"
//                 >
//                   <Search size={18} className="text-gray-600" />
//                 </button>
//               ) : (
//                 <div className="flex items-center gap-2 flex-1">
//                   <div className="relative flex-1">
//                     <input
//                       type="text"
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       placeholder="Search items..."
//                       className="px-3 py-2 pr-8 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
//                       autoFocus
//                     />
//                     {searchQuery && (
//                       <button
//                         onClick={() => setSearchQuery('')}
//                         className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                       >
//                         <X size={16} />
//                       </button>
//                     )}
//                   </div>
//                   <button
//                     onClick={() => {
//                       setShowSearch(false)
//                       setSearchQuery('')
//                     }}
//                     className="p-2.5 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors"
//                   >
//                     <X size={18} className="text-gray-600" />
//                   </button>
//                 </div>
//               )}

//               {!showSearch && (
//                 <>
//                   <select
//                     value={categoryFilter}
//                     onChange={(e) => setCategoryFilter(e.target.value)}
//                     className="border rounded px-2 py-2 text-sm bg-white flex-1"
//                   >
//                     <option>All items</option>
//                     {categoriesData?.map((cat, categoryId) => (
//                       <option key={categoryId}>{cat.name}</option>
//                     ))}
//                   </select>

//                   <select
//                     value={stockFilter}
//                     onChange={(e) => setStockFilter(e.target.value)}
//                     className="border rounded px-2 py-2 text-sm bg-white"
//                   >
//                     <option>Stock: All</option>
//                   </select>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Desktop Layout */}
//           <div className="hidden md:flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => openModal()}
//                 className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 font-medium"
//               >
//                 <Plus size={18} /> ADD ITEM
//               </button>

//               {selectedItems.size > 0 ? (
//                 <button
//                   onClick={deleteSelectedItems}
//                   className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 font-medium"
//                 >
//                   <Trash2 size={18} /> DELETE ({selectedItems.size})
//                 </button>
//               ) : (
//                 <>
//                   <label className="text-gray-700 font-medium px-4 py-2 hover:bg-gray-100 rounded cursor-pointer">
//                     IMPORT
//                     <input
//                       type="file"
//                       accept=".csv"
//                       onChange={handleImport}
//                       className="hidden"
//                     />
//                   </label>
//                   <button
//                     onClick={exportToCSV}
//                     className="text-gray-700 font-medium px-4 py-2 hover:bg-gray-100 rounded"
//                   >
//                     EXPORT
//                   </button>
//                 </>
//               )}
//             </div>

//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <label className="text-sm text-gray-600">Category</label>
//                 <select
//                   value={categoryFilter}
//                   onChange={(e) => setCategoryFilter(e.target.value)}
//                   className="border rounded px-3 py-1.5 text-sm bg-white min-w-[150px]"
//                 >
//                   <option>All items</option>
//                   {categoriesData?.map((category, categoryId) => (
//                     <option key={categoryId}>{category.name}</option>
//                   ))}
//                 </select>
//               </div>

//               <div className="flex items-center gap-2">
//                 <label className="text-sm text-gray-600">Stock alert</label>
//                 <select
//                   value={stockFilter}
//                   onChange={(e) => setStockFilter(e.target.value)}
//                   className="border rounded px-3 py-1.5 text-sm bg-white min-w-[150px]"
//                 >
//                   <option>All items</option>
//                   <option>Low stock</option>
//                   <option>Out stock</option>
//                 </select>
//               </div>

//               {!showSearch ? (
//                 <button
//                   onClick={() => setShowSearch(true)}
//                   className="p-2.5 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors"
//                 >
//                   <Search size={18} className="text-gray-600" />
//                 </button>
//               ) : (
//                 <div className="flex items-center gap-2">
//                   <div className="relative">
//                     <input
//                       type="text"
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       placeholder="Search..."
//                       className="px-3 py-2 pr-8 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-48"
//                       autoFocus
//                     />
//                     {searchQuery && (
//                       <button
//                         onClick={() => setSearchQuery('')}
//                         className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                       >
//                         <X size={16} />
//                       </button>
//                     )}
//                   </div>
//                   <button
//                     onClick={() => {
//                       setShowSearch(false)
//                       setSearchQuery('')
//                     }}
//                     className="p-2.5 border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors"
//                   >
//                     <X size={18} className="text-gray-600" />
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Table - Desktop */}
//       <div className="hidden md:block bg-white m-4 rounded-lg shadow-sm overflow-x-auto">
//         <table className="w-full">
//           <thead className="border-b bg-gray-50">
//             <tr>
//               <th className="w-12 p-4">
//                 <input
//                   type="checkbox"
//                   className="w-4 h-4"
//                   checked={
//                     selectedItems.size === filteredItems.length &&
//                     filteredItems.length > 0
//                   }
//                   onChange={toggleAllItems}
//                 />
//               </th>
//               <th className="text-center p-4 text-sm font-medium text-gray-700">
//                 Item name ↑
//               </th>
//               <th className="text-center p-4 text-sm font-medium text-gray-700">
//                 Category
//               </th>
//               <th className="text-center p-4 text-sm font-medium text-gray-700">
//                 Price
//               </th>
//               <th className="text-center p-4 text-sm font-medium text-gray-700">
//                 Cost
//               </th>
//               <th className="text-center p-4 text-sm font-medium text-gray-700">
//                 Margin
//               </th>
//               <th className="text-center p-4 text-sm font-medium text-gray-700">
//                 In stock
//               </th>
//               <th className="text-center p-4 text-sm font-medium text-gray-700">
//                 Barcode
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredItems.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="p-8 text-center text-gray-500">
//                   No items found. Click ADD ITEM to create your first item.
//                 </td>
//               </tr>
//             ) : (
//               item?.map((items: GetItem) => (
//                 <React.Fragment key={items.itemId}>
//                   <tr className="border-b hover:bg-gray-50">
//                     <td className="p-4">
//                       {items.variantSku && items.variantSku.length > 0 && (
//                         <button
//                           onClick={() => toggleExpand(items.itemId)}
//                           className="p-1"
//                         >
//                           {items.expanded ? (
//                             <ChevronDown size={18} />
//                           ) : (
//                             <ChevronRight size={18} />
//                           )}
//                         </button>
//                       )}
//                     </td>
//                     <td className="p-4">
//                       <input
//                         type="checkbox"
//                         className="w-4 h-4 mr-3 inline-block"
//                         checked={selectedItems.has(items.itemId)}
//                         onChange={() => toggleItemSelection(items.itemId)}
//                       />
//                       <button
//                         onClick={() => openModal(items)}
//                         className="text-blue-600 hover:underline"
//                       >
//                         {items.name}
//                       </button>
//                     </td>
//                     <td className="p-4 text-gray-700">
//                       {items.categoryName || '-'}
//                     </td>
//                     <td className="p-4 text-gray-700">
//                       {items.price ? `Tk${items.price}` : '-'}
//                     </td>
//                     <td className="p-4 text-gray-700">
//                       {items.cost ? `Tk${items.cost}` : '-'}
//                     </td>
//                     <td className="p-4 text-gray-700">{items.margin || '-'}</td>
//                     <td className="p-4 text-gray-700">
//                       {items.inStock?.toLocaleString() || 0}
//                     </td>
//                     <td className="p-4 text-gray-700">
//                       {items.barcode ? (
//                         <div className="flex flex-col items-center">
//                           <Barcode
//                             value={String(items.barcode)}
//                             width={1.2}
//                             height={40}
//                             fontSize={12}
//                             displayValue={true} // shows number under barcode
//                           />
//                         </div>
//                       ) : (
//                         0
//                       )}
//                     </td>
//                   </tr>
//                 </React.Fragment>
//               ))
//             )}
//           </tbody>
//         </table>

//         <div className="flex items-center justify-between p-4 border-t">
//           <div className="flex items-center gap-2">
//             <button className="p-2 border rounded hover:bg-gray-50">
//               <ChevronRight size={18} className="rotate-180" />
//             </button>
//             <button className="p-2 border rounded hover:bg-gray-50">
//               <ChevronRight size={18} />
//             </button>
//           </div>
//           <div className="flex items-center gap-4 text-sm">
//             <span className="text-gray-600">Page:</span>
//             <input
//               type="text"
//               value="1"
//               className="w-12 text-center border rounded px-2 py-1"
//               readOnly
//             />
//             <span className="text-gray-600">of 1</span>
//             <span className="text-gray-600 ml-6">Rows per page:</span>
//             <select className="border rounded px-2 py-1 bg-white">
//               <option>10</option>
//               <option>25</option>
//               <option>50</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Card View - Mobile */}
//       <div className="md:hidden p-4 space-y-3">
//         {filteredItems.length === 0 ? (
//           <div className="bg-white rounded-lg p-8 text-center text-gray-500">
//             No items found. Click ADD ITEM to create your first item.
//           </div>
//         ) : (
//           filteredItems.map((item) => (
//             <div
//               key={item.itemId}
//               className="bg-white rounded-lg border shadow-sm p-4"
//             >
//               <div className="flex items-start justify-between mb-3">
//                 <div className="flex items-start gap-3 flex-1">
//                   <input
//                     type="checkbox"
//                     className="w-4 h-4 mt-1"
//                     checked={selectedItems.has(item.itemId)}
//                     onChange={() => toggleItemSelection(item.itemId)}
//                   />
//                   <div className="flex-1">
//                     <button
//                       onClick={() => openModal(item)}
//                       className="text-blue-600 hover:underline font-medium text-left"
//                     >
//                       {item.name}
//                     </button>
//                     <p className="text-sm text-gray-600 mt-1">
//                       {item.categoryName || 'No category'}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-3 text-sm">
//                 <div>
//                   <span className="text-gray-600">Price:</span>
//                   <span className="ml-2 font-medium">
//                     {item.price ? `Tk${item.price}` : '-'}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-gray-600">Cost:</span>
//                   <span className="ml-2 font-medium">
//                     {item.cost ? `Tk${item.cost}` : '-'}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-gray-600">Margin:</span>
//                   <span className="ml-2 font-medium">{item.margin || '-'}</span>
//                 </div>
//                 <div>
//                   <span className="text-gray-600">In Stock:</span>
//                   <span className="ml-2 font-medium">
//                     {item.inStock?.toLocaleString() || 0}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
//             <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
//               <h2 className="text-xl font-semibold">
//                 {currentItem ? 'Edit Item' : 'New Item'}
//               </h2>
//               <button
//                 onClick={closeModal}
//                 className="p-1 hover:bg-gray-100 rounded"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-6 space-y-5">
//               {/* Name and Category Row */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1.5">
//                     Name
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.name}
//                     onChange={(e) =>
//                       setFormData({ ...formData, name: e.target.value })
//                     }
//                     placeholder="new items"
//                     className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1.5">
//                     Category
//                   </label>
//                   <select
//                     value={formData.category}
//                     onChange={(e) =>
//                       setFormData({ ...formData, category: e.target.value })
//                     }
//                     className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
//                   >
//                     <option>No category</option>
//                     {categoriesData?.map((cat, categoryId) => (
//                       <option key={categoryId}>{cat.name}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block text-sm text-gray-700 mb-1.5">
//                   Description
//                 </label>
//                 <textarea
//                   value={formData.description}
//                   onChange={(e) =>
//                     setFormData({ ...formData, description: e.target.value })
//                   }
//                   placeholder="new idea"
//                   className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
//                   rows={3}
//                 />
//               </div>

//               {/* Subtitle and Switches */}
//               <div className="space-y-3">
//                 <div className="flex items-center gap-3">
//                   <span className="text-sm text-gray-700">Subtitle</span>
//                   <label className="relative inline-block w-11 h-6">
//                     <input
//                       type="checkbox"
//                       checked={formData.availableForSale}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           availableForSale: e.target.checked,
//                         })
//                       }
//                       className="sr-only peer"
//                     />
//                     <div className="w-full h-full bg-gray-200 peer-checked:bg-green-500 rounded-full transition-colors"></div>
//                     <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:left-6 transition-all"></div>
//                   </label>
//                   <span className="text-sm text-gray-700">track</span>
//                   <label className="relative inline-block w-11 h-6">
//                     <input
//                       type="checkbox"
//                       checked={formData.trackStock}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           trackStock: e.target.checked,
//                         })
//                       }
//                       className="sr-only peer"
//                     />
//                     <div className="w-full h-full bg-gray-200 peer-checked:bg-green-500 rounded-full transition-colors"></div>
//                     <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:left-6 transition-all"></div>
//                   </label>
//                   <span className="text-sm text-gray-700">Weight/Volume</span>
//                 </div>
//               </div>

//               {/* Price and Cost */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1.5">
//                     Price
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.price}
//                     onChange={(e) =>
//                       setFormData({ ...formData, price: e.target.value })
//                     }
//                     placeholder="Tk 1,000.00"
//                     className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">
//                     To check the price per count, price must have from fixed
//                     cost
//                   </p>
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-700 mb-1.5">
//                     Cost
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.cost}
//                     onChange={(e) =>
//                       setFormData({ ...formData, cost: e.target.value })
//                     }
//                     placeholder="Tk 1,000.00"
//                     className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                   />
//                 </div>
//               </div>

//               {/* SKU */}
//               <div>
//                 <label className="block text-sm text-gray-700 mb-1.5">
//                   SKU
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.sku}
//                   onChange={(e) =>
//                     setFormData({ ...formData, sku: e.target.value })
//                   }
//                   placeholder="new items-1700"
//                   className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   Unique identifier assigned to an item
//                 </p>
//               </div>

//               {/* Inventory Section */}
//               <div>
//                 <h3 className="font-semibold mb-3 text-base">Inventory</h3>
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between py-2">
//                     <div className="flex items-center gap-2">
//                       <span className="text-sm text-gray-700">
//                         Composite item
//                       </span>
//                       <span className="text-gray-400 text-xs">ⓘ</span>
//                     </div>
//                     <label className="relative inline-block w-11 h-6">
//                       <input
//                         type="checkbox"
//                         checked={formData.compositeItem}
//                         onChange={(e) =>
//                           setFormData({
//                             ...formData,
//                             compositeItem: e.target.checked,
//                           })
//                         }
//                         className="sr-only peer"
//                       />
//                       <div className="w-full h-full bg-gray-200 peer-checked:bg-green-500 rounded-full transition-colors"></div>
//                       <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:left-6 transition-all"></div>
//                     </label>
//                   </div>

//                   {formData.compositeItem && (
//                     <div className="border rounded-lg p-4 bg-gray-50">
//                       <div className="space-y-3 mb-3">
//                         <div className="text-xs text-gray-600 font-medium mb-2">
//                           COMPONENT • QUANTITY • COST
//                         </div>
//                         {formData.components.map((comp, idx) => (
//                           <div key={idx} className="flex gap-2 items-center">
//                             <input
//                               type="text"
//                               placeholder="new items"
//                               value={comp.name}
//                               onChange={(e) =>
//                                 updateComponent(idx, 'name', e.target.value)
//                               }
//                               className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
//                             />
//                             <input
//                               type="text"
//                               placeholder="1,000"
//                               value={comp.quantity}
//                               onChange={(e) =>
//                                 updateComponent(idx, 'quantity', e.target.value)
//                               }
//                               className="w-20 border border-gray-300 rounded px-3 py-2 text-sm"
//                             />
//                             <input
//                               type="text"
//                               placeholder="Tk657.00"
//                               value={comp.cost}
//                               onChange={(e) =>
//                                 updateComponent(idx, 'cost', e.target.value)
//                               }
//                               className="w-28 border border-gray-300 rounded px-3 py-2 text-sm"
//                             />
//                             <button
//                               onClick={() => removeComponent(idx)}
//                               className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
//                             >
//                               <Trash2 size={16} />
//                             </button>
//                           </div>
//                         ))}
//                         <div className="flex gap-2">
//                           <input
//                             type="text"
//                             placeholder="fixed type"
//                             className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
//                           />
//                           <input
//                             type="text"
//                             placeholder="1,000"
//                             className="w-20 border border-gray-300 rounded px-3 py-2 text-sm"
//                           />
//                           <input
//                             type="text"
//                             placeholder="Tk657.00"
//                             className="w-28 border border-gray-300 rounded px-3 py-2 text-sm"
//                           />
//                           <button className="p-2 text-gray-400">
//                             <Trash2 size={16} />
//                           </button>
//                         </div>
//                         <div className="flex gap-2">
//                           <input
//                             type="text"
//                             placeholder="item search"
//                             className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
//                           />
//                           <div className="w-20"></div>
//                           <div className="w-28"></div>
//                           <div className="w-8"></div>
//                         </div>
//                       </div>
//                       <button
//                         onClick={addComponent}
//                         className="text-green-600 text-sm flex items-center gap-1 hover:text-green-700 mb-3"
//                       >
//                         <Plus size={16} /> Add component
//                       </button>
//                       <div className="text-right text-sm font-semibold border-t pt-3">
//                         Total cost: Tk{getTotalCost()}
//                       </div>
//                     </div>
//                   )}

//                   <div className="flex items-center justify-between py-2">
//                     <div className="flex items-center gap-2">
//                       <span className="text-sm text-gray-700">
//                         User production
//                       </span>
//                       <span className="text-gray-400 text-xs">ⓘ</span>
//                     </div>
//                     <label className="relative inline-block w-11 h-6">
//                       <input type="checkbox" className="sr-only peer" />
//                       <div className="w-full h-full bg-gray-200 peer-checked:bg-green-500 rounded-full transition-colors"></div>
//                       <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:left-6 transition-all"></div>
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               {/* Stores Section */}
//               <div>
//                 <h3 className="font-semibold mb-3 text-base">Stores</h3>
//                 <div className="border rounded-lg overflow-hidden">
//                   <div className="bg-blue-50 border-b border-blue-100 p-3 flex items-center gap-2">
//                     <input type="checkbox" className="w-4 h-4" defaultChecked />
//                     <span className="text-sm text-blue-900">
//                       This item is available for sale at all stores
//                     </span>
//                   </div>
//                   <div className="divide-y">
//                     <div className="grid grid-cols-5 gap-3 p-3 bg-gray-50 text-xs text-gray-600 font-medium">
//                       <div>AVAILABLE</div>
//                       <div>NAME</div>
//                       <div>PRICE</div>
//                       <div>IN STOCK</div>
//                       <div>LOW STOCK</div>
//                     </div>
//                     <div className="grid grid-cols-5 gap-3 p-3 items-center">
//                       <div>
//                         <input
//                           type="checkbox"
//                           className="w-4 h-4 text-green-500"
//                           defaultChecked
//                         />
//                       </div>
//                       <div className="text-sm">toolbar</div>
//                       <div className="text-sm">Tk1,000.00</div>
//                       <div className="text-sm">5</div>
//                       <div className="text-sm">1</div>
//                     </div>
//                     <div className="grid grid-cols-5 gap-3 p-3 items-center bg-green-50">
//                       <div>
//                         <input
//                           type="checkbox"
//                           className="w-4 h-4 text-green-500"
//                           defaultChecked
//                         />
//                       </div>
//                       <div className="text-sm font-medium">New toolbar</div>
//                       <div className="text-sm">Tk1,000.00</div>
//                       <div className="text-sm">3</div>
//                       <div className="text-sm">1</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Representation on POS */}
//               <div>
//                 <h3 className="font-semibold mb-3 text-base">
//                   Representation on POS
//                 </h3>
//                 <div className="flex gap-4 mb-3">
//                   <label className="flex items-center gap-2">
//                     <input type="radio" defaultChecked className="w-4 h-4" />
//                     <span className="text-sm">Color and shape</span>
//                   </label>
//                   <label className="flex items-center gap-2">
//                     <input type="radio" className="w-4 h-4" />
//                     <span className="text-sm">Image</span>
//                   </label>
//                 </div>

//                 <div className="flex gap-2 mb-3 flex-wrap">
//                   {colors.map((color) => (
//                     <button
//                       key={color}
//                       onClick={() => setFormData({ ...formData, color })}
//                       className={`w-10 h-10 rounded ${formData.color === color ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
//                       style={{ backgroundColor: color }}
//                     />
//                   ))}
//                 </div>

//                 <div className="flex gap-2 flex-wrap">
//                   {shapes.map((shape) => (
//                     <button
//                       key={shape}
//                       onClick={() => setFormData({ ...formData, shape })}
//                       className={`w-12 h-12 border-2 rounded flex items-center justify-center ${formData.shape === shape ? 'border-blue-500' : 'border-gray-300'}`}
//                     >
//                       {shape === 'check' && (
//                         <div className="w-6 h-6 border-2 border-gray-400"></div>
//                       )}
//                       {shape === 'circle' && (
//                         <div className="w-6 h-6 rounded-full border-2 border-gray-400"></div>
//                       )}
//                       {shape === 'dashed-circle' && (
//                         <div className="w-6 h-6 rounded-full border-2 border-dashed border-gray-400"></div>
//                       )}
//                       {shape === 'hexagon' && (
//                         <div
//                           className="w-6 h-6 border-2 border-gray-400"
//                           style={{
//                             clipPath:
//                               'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
//                           }}
//                         ></div>
//                       )}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end gap-3">
//               <button
//                 onClick={closeModal}
//                 className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700 font-medium"
//               >
//                 CANCEL
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showVariantModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg w-full max-w-2xl">
//             <div className="border-b p-4 flex items-center justify-between">
//               <h2 className="text-xl font-semibold">Create options</h2>
//               <button
//                 onClick={closeVariantModal}
//                 className="p-1 hover:bg-gray-100 rounded"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
//               {variants.map((variant, vIdx) => (
//                 <div key={vIdx} className="border-b pb-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
//                     <div>
//                       <label className="block text-sm text-gray-600 mb-2">
//                         Option name
//                       </label>
//                       <div className="flex items-center gap-2">
//                         <div className="text-gray-400">☰</div>
//                         <input
//                           type="text"
//                           value={variant.name}
//                           onChange={(e) =>
//                             updateVariantName(vIdx, e.target.value)
//                           }
//                           placeholder="e.g., Size, Color"
//                           className="flex-1 border rounded px-3 py-2"
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-sm text-gray-600 mb-2">
//                         Option values
//                       </label>
//                       <div className="flex flex-wrap gap-2 mb-2">
//                         {variant.values.map((value, vvIdx) => (
//                           <span
//                             key={vvIdx}
//                             className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
//                           >
//                             {value}
//                             <button
//                               onClick={() => removeVariantValue(vIdx, vvIdx)}
//                               className="text-gray-600 hover:text-gray-800"
//                             >
//                               <X size={14} />
//                             </button>
//                           </span>
//                         ))}
//                       </div>
//                       <input
//                         type="text"
//                         placeholder="Press Enter to add the value"
//                         className="w-full border rounded px-3 py-2 text-sm"
//                         onKeyPress={(e) => {
//                           if (e.key === 'Enter' && e.currentTarget.value) {
//                             addVariantValue(vIdx, e.currentTarget.value)
//                             e.currentTarget.value = ''
//                           }
//                         }}
//                       />
//                     </div>
//                   </div>
//                   {variants.length > 1 && (
//                     <button
//                       onClick={() => removeVariant(vIdx)}
//                       className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
//                     >
//                       <Trash2 size={14} /> Remove option
//                     </button>
//                   )}
//                 </div>
//               ))}

//               <button
//                 onClick={addVariant}
//                 className="text-green-600 text-sm flex items-center gap-1 hover:text-green-700"
//               >
//                 <Plus size={16} /> ADD OPTION
//               </button>
//             </div>

//             <div className="border-t p-4 flex justify-end gap-3">
//               <button
//                 onClick={closeVariantModal}
//                 className="px-6 py-2 border rounded hover:bg-gray-50 text-gray-700 font-medium"
//               >
//                 CANCEL
//               </button>
//               <button
//                 onClick={closeVariantModal}
//                 className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
//               >
//                 SAVE
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default InventoryManagement
