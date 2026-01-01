'use client'

import React, { useState, useEffect } from 'react'
import {
  useCategories,
  useCreateCategory,
  useEditCategory,
  useDeleteCategory,
} from '@/hooks/use-categories'
import { CreateCategory, GetCategory, UpdateCategory } from '@/types/categories'

type Category = {
  id?: string
  name: string
  color: string
}

const Categories: React.FC = () => {
  const { data: categoriesData, isLoading, error } = useCategories()
  const [categories, setCategories] = useState<Category[]>([])
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

  // Reset modal fields
  const reset = () => {
    setName('')
    setColor('#F44336')
    setEditIndex(null)
  }

  // Create/Edit/Delete hooks
  const createMutation = useCreateCategory({
    onClose: () => setOpen(false),
    reset,
  })

  const editMutation = useEditCategory({
    onClose: () => setOpen(false),
    reset,
  })

  const deleteMutation = useDeleteCategory()

  useEffect(() => {
    if (categoriesData) {
      setCategories(
        categoriesData.map((c: GetCategory) => ({
          id: c.categoryId.toString(),
          name: c.name,
          color: c.color || '#2196F3',
        }))
      )
    }
  }, [categoriesData])

  // Open Add Modal
  const openAdd = (): void => {
    reset()
    setOpen(true)
  }

  // Open Edit Modal
  const openEdit = (cat: Category, index: number): void => {
    setName(cat.name)
    setColor(cat.color)
    setEditIndex(index)
    setOpen(true)
  }

  // Save Category (Create or Update)
  const handleSave = (): void => {
    if (!name.trim()) return

    if (editIndex !== null && categories[editIndex]?.id) {
      const updateData: UpdateCategory = { name, color }
      editMutation.mutate({ id: categories[editIndex].id!, data: updateData })
    } else {
      const createData: CreateCategory = { name, color }
      createMutation.mutate(createData)
    }
  }

  // Delete a single category
  const handleDelete = (): void => {
    if (editIndex === null) return
    const id = categories[editIndex]?.id
    if (id) deleteMutation.mutate(id)
    setOpen(false)
  }

  // Bulk Delete
  const deleteSelected = (): void => {
    selected.forEach((index) => {
      const id = categories[index]?.id
      if (id) deleteMutation.mutate(id)
    })
    setSelected(new Set())
    setCurrentPage(1)
  }

  // Selection handlers
  const toggleSelect = (index: number): void => {
    const newSelected = new Set(selected)
    if (newSelected.has(index)) newSelected.delete(index)
    else newSelected.add(index)
    setSelected(newSelected)
  }

  const toggleSelectAll = (): void => {
    if (selected.size === categories.length) setSelected(new Set())
    else setSelected(new Set(categories.map((_, i) => i)))
  }

  const allSelected =
    categories.length > 0 && selected.size === categories.length

  // Pagination
  const totalPages = Math.ceil(categories.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedCategories = categories.slice(startIndex, endIndex)

  const handleItemsPerPageChange = (newItemsPerPage: number): void => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  if (isLoading) return <p className="p-3 md:p-6">Loading categories...</p>
  if (error)
    return <p className="p-3 md:p-6 text-red-500">Failed to load categories</p>

  return (
    <div className="p-3 md:p-6 mt-6 md:mt-10 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
        <button
          onClick={openAdd}
          className="bg-green-500 text-white px-5 py-2 rounded shadow hover:bg-green-600 transition-colors text-xs md:text-sm"
        >
          + ADD CATEGORY
        </button>

        {selected.size > 0 && (
          <button
            onClick={deleteSelected}
            className="flex items-center justify-center gap-2 text-gray-700 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors text-xs md:text-sm"
          >
            <span className="text-base md:text-lg">🗑</span>
            <span className="font-medium">DELETE ({selected.size})</span>
          </button>
        )}
      </div>

      {/* Category List */}
      <div className="mt-4 md:mt-6">
        {/* Desktop Header */}
        {categories.length > 0 && (
          <div className="hidden md:flex items-center gap-4 py-3 border-b bg-gray-50">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              className="w-5 h-5 accent-green-500"
            />
            <span className="font-medium text-gray-700 text-xs">Name</span>
          </div>
        )}

        {/* Mobile: Select All */}
        {categories.length > 0 && (
          <div className="md:hidden flex items-center gap-3 py-3 px-2 border-b bg-gray-50">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              className="w-5 h-5 accent-green-500"
            />
            <span className="text-xs font-medium text-gray-700">
              Select All ({categories.length})
            </span>
          </div>
        )}

        {/* Category Items */}
        {paginatedCategories.map((cat, displayIndex) => {
          const actualIndex = startIndex + displayIndex
          return (
            <div
              key={actualIndex}
              className="flex items-center gap-3 md:gap-4 py-3 md:py-4 px-2 md:px-0 border-b hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <input
                type="checkbox"
                checked={selected.has(actualIndex)}
                onChange={() => toggleSelect(actualIndex)}
                className="w-5 h-5 accent-green-500 flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              />
              <div
                onClick={() => openEdit(cat, actualIndex)}
                className="flex items-center gap-3 md:gap-4 flex-1 cursor-pointer min-w-0"
              >
                <div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-xs md:text-sm truncate">{cat.name}</p>
                  <p className="text-xs text-gray-500">0 items</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {categories.length > 0 && (
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

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-[500px] rounded-lg p-4 md:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-base md:text-lg font-semibold mb-4">
              {editIndex !== null ? 'Edit Category' : 'Add Category'}
            </h2>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              className="w-full border px-3 py-2 rounded mb-6 text-xs md:text-sm"
            />

            {/* Color Picker */}
            <div className="grid grid-cols-4 sm:flex sm:flex-wrap gap-2 md:gap-3 mb-6 md:mb-8">
              {colors.map((c) => (
                <div
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-full aspect-square sm:w-12 sm:h-12 rounded cursor-pointer flex items-center justify-center
                    ${color === c ? 'ring-2 ring-black' : ''} hover:ring-2 hover:ring-gray-400 transition-all`}
                  style={{ backgroundColor: c }}
                >
                  {color === c && (
                    <span className="text-white font-bold text-base">✓</span>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              {editIndex !== null && (
                <button
                  onClick={handleDelete}
                  type="button"
                  title="Delete category"
                  className="text-gray-500 hover:text-gray-700 text-lg md:text-xl p-2"
                >
                  🗑
                </button>
              )}

              <div className="flex gap-4 md:gap-6 ml-auto">
                <button
                  onClick={() => setOpen(false)}
                  type="button"
                  className="text-gray-600 hover:text-gray-800 font-medium text-xs md:text-sm px-2"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSave}
                  type="button"
                  className="text-green-600 hover:text-green-700 font-semibold text-xs md:text-sm px-2"
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


