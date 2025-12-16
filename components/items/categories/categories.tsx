'use client'

import React, { useState } from 'react'

type Category = {
  name: string
  color: string
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    { name: 'Work', color: '#2196F3' },
    { name: 'Personal', color: '#4CAF50' },
    { name: 'Shopping', color: '#FF9800' },
  ])
  const [open, setOpen] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [color, setColor] = useState<string>('#F44336')
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)

  const colors: string[] = [
    '#E0E0E0',
    '#F44336',
    '#E91E63',
    '#FF9800',
    '#CDDC39',
    '#4CAF50',
    '#2196F3',
    '#9C27B0',
  ]

  // Open Add Modal
  const openAdd = (): void => {
    setName('')
    setColor('#F44336')
    setEditIndex(null)
    setOpen(true)
  }

  // Open Edit Modal
  const openEdit = (cat: Category, index: number): void => {
    setName(cat.name)
    setColor(cat.color)
    setEditIndex(index)
    setOpen(true)
  }

  // Save Category
  const handleSave = (): void => {
    if (!name.trim()) return

    if (editIndex !== null) {
      const updated = [...categories]
      updated[editIndex] = { name, color }
      setCategories(updated)
    } else {
      setCategories((prev) => [...prev, { name, color }])
    }

    setOpen(false)
  }

  // Delete Category
  const handleDelete = (): void => {
    if (editIndex === null) return
    setCategories((prev) => prev.filter((_, i) => i !== editIndex))
    setOpen(false)
  }

  // Toggle checkbox selection
  const toggleSelect = (index: number): void => {
    const newSelected = new Set(selected)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelected(newSelected)
  }

  // Toggle select all
  const toggleSelectAll = (): void => {
    if (selected.size === categories.length) {
      // If all are selected, deselect all
      setSelected(new Set())
    } else {
      // Select all categories
      const allIndices = categories.map((_, index) => index)
      setSelected(new Set(allIndices))
    }
  }

  // Check if all categories are selected
  const allSelected =
    categories.length > 0 && selected.size === categories.length

  // Delete selected categories
  const deleteSelected = (): void => {
    setCategories((prev) => prev.filter((_, i) => !selected.has(i)))
    setSelected(new Set())
    setCurrentPage(1)
  }

  // Pagination calculations
  const totalPages = Math.ceil(categories.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedCategories = categories.slice(startIndex, endIndex)

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number): void => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  return (
    <div className="p-3 mt-10 border-t-2 border-green-500">
      {/* Header with Add and Delete buttons */}
      <div className="flex gap-4 items-center">
        <button
          onClick={openAdd}
          className="bg-green-500 text-white px-5 py-2 rounded shadow"
        >
          + ADD CATEGORY
        </button>

        {selected.size > 0 && (
          <button
            onClick={deleteSelected}
            className="flex items-center gap-2 text-gray-700 border border-gray-300 px-4 py-2 rounded"
          >
            <span className="text-xl">🗑</span>
            <span className="font-medium">DELETE</span>
          </button>
        )}
      </div>

      {/* Category List */}
      <div className="mt-6">
        {/* Header Row with Select All */}
        {categories.length > 0 && (
          <div className="flex items-center gap-4 py-3 border-b bg-gray-50">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              className="w-5 h-5 accent-green-500"
            />
            <span className="font-medium text-gray-700">Name</span>
          </div>
        )}

        {/* Category Items */}
        {paginatedCategories.map((cat, displayIndex) => {
          const actualIndex = startIndex + displayIndex
          return (
            <div
              key={actualIndex}
              className="flex items-center gap-4 py-4 border-b hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selected.has(actualIndex)}
                onChange={() => toggleSelect(actualIndex)}
                className="w-5 h-5 accent-green-500"
                onClick={(e) => e.stopPropagation()}
              />
              <div
                onClick={() => openEdit(cat, actualIndex)}
                className="flex items-center gap-4 flex-1 cursor-pointer"
              >
                <div
                  className="w-10 h-10 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <div>
                  <p className="font-medium">{cat.name}</p>
                  <p className="text-sm text-gray-500">0 items</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {categories.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 border rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 border rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ›
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">Page:</span>
            <input
              type="number"
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value)
                if (page >= 1 && page <= totalPages) {
                  setCurrentPage(page)
                }
              }}
              className="w-16 border rounded px-2 py-1 text-center"
              min={1}
              max={totalPages}
            />
            <span className="text-sm">of {totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">Rows per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="border rounded px-3 py-1 text-sm cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-[500px] rounded p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editIndex !== null ? 'Edit Category' : 'Add Category'}
            </h2>

            {/* Name Input */}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              className="w-full border px-3 py-2 rounded mb-6"
            />

            {/* Color Picker */}
            <div className="flex gap-3 mb-8">
              {colors.map((c) => (
                <div
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-12 h-12 rounded cursor-pointer flex items-center justify-center
                    ${color === c ? 'ring-2 ring-black' : ''}`}
                  style={{ backgroundColor: c }}
                >
                  {color === c && (
                    <span className="text-white font-bold">✓</span>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">
              {/* Delete Button (Bottom Left) */}
              {editIndex !== null && (
                <button
                  onClick={handleDelete}
                  type="button"
                  title="Delete category"
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  🗑
                </button>
              )}

              {/* Save / Cancel */}
              <div className="flex gap-6 ml-auto">
                <button
                  onClick={() => setOpen(false)}
                  type="button"
                  className="text-gray-600"
                >
                  CANCEL
                </button>

                <button
                  onClick={handleSave}
                  type="button"
                  className="text-green-600 font-semibold"
                >
                  SAVE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Categories
