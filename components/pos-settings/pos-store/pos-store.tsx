'use client'

import React, { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'

import {
  useStores,
  useCreateStore,
  useEditStore,
  useDeleteStore,
} from '@/hooks/use-stores'
import { GetStore, CreateStore, UpdateStore } from '@/types/stores'

interface FormData {
  name: string
  address: string
  city: string
  region: string
  postalCode: string
  country: string
  phone: string
  description: string
}

const emptyForm: FormData = {
  name: '',
  address: '',
  city: '',
  region: '',
  postalCode: '',
  country: 'Bangladesh',
  phone: '',
  description: '',
}

const PosStore = () => {
  /* =========================
     STATE
  ========================= */
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStore, setEditingStore] = useState<GetStore | null>(null)
  const [formData, setFormData] = useState<FormData>(emptyForm)

  /* =========================
     QUERIES & MUTATIONS
  ========================= */
  const { data: stores, isLoading } = useStores()

  const createStoreMutation = useCreateStore({
    onClose: () => setIsModalOpen(false),
    reset: () => setFormData(emptyForm),
  })

  const editStoreMutation = useEditStore({
    onClose: () => setIsModalOpen(false),
    reset: () => setFormData(emptyForm),
  })

  const deleteStoreMutation = useDeleteStore()

  /* =========================
     HANDLERS
  ========================= */
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddStore = () => {
    setEditingStore(null)
    setFormData(emptyForm)
    setIsModalOpen(true)
  }

  const handleRowClick = (store: GetStore) => {
    setEditingStore(store)
    setFormData({
      name: store.name,
      address: store.address,
      city: store.city,
      region: store.region,
      postalCode: store.postalCode,
      country: store.country,
      phone: store.phone,
      description: store.description || '',
    })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.address || !formData.city) return

    if (editingStore) {
      const payload: UpdateStore = { ...formData }
      editStoreMutation.mutate({
        id: editingStore.storeId.toString(),
        data: payload,
      })
    } else {
      const payload: CreateStore = {
        ...formData,
        numberOfPOS: 1,
      }
      createStoreMutation.mutate(payload)
    }
  }

  const handleDeleteStore = () => {
    if (!editingStore) return
    if (!window.confirm('Are you sure you want to delete this store?')) return

    deleteStoreMutation.mutate(editingStore.storeId.toString())
    setIsModalOpen(false)
    setEditingStore(null)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setEditingStore(null)
    setFormData(emptyForm)
  }

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <button
            onClick={handleAddStore}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded flex items-center gap-2"
          >
            <Plus size={20} />
            ADD STORE
          </button>
        </div>

        {/* Desktop */}
        <div className="hidden md:block bg-white rounded shadow">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Address</th>
                <th className="px-6 py-4 text-left">POS</th>
              </tr>
            </thead>
            <tbody>
              {stores?.map((store) => (
                <tr
                  key={store.storeId}
                  onClick={() => handleRowClick(store)}
                  className="cursor-pointer hover:bg-gray-50 border-b"
                >
                  <td className="px-6 py-4">{store.name}</td>
                  <td className="px-6 py-4 text-gray-600">{store.address}</td>
                  <td className="px-6 py-4">{store.numberOfPOS}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden space-y-4">
          {stores?.map((store) => (
            <div
              key={store.storeId}
              onClick={() => handleRowClick(store)}
              className="bg-white p-4 rounded shadow"
            >
              <h3 className="font-semibold">{store.name}</h3>
              <p className="text-sm text-gray-600">{store.address}</p>
              <p className="text-sm">POS: {store.numberOfPOS}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white w-full max-w-md rounded-lg p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between mb-4">
        <h2 className="font-semibold">
          {editingStore ? 'Edit Store' : 'Add Store'}
        </h2>
        <button onClick={handleCancel}>
          <X />
        </button>
      </div>

      {/* FORM */}
      <div className="space-y-3">
        {Object.entries(formData).map(([key, value]) =>
          key !== 'country' ? (
            <div key={key} className="flex flex-col">
              <label htmlFor={key} className="text-sm text-gray-600 mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                id={key}
                name={key}
                value={value}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <div key={key} className="flex flex-col">
              <label htmlFor="country" className="text-sm text-gray-600 mb-1">
                Country
              </label>
              <select
                id="country"
                name="country"
                value={value}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Bangladesh</option>
                <option>India</option>
                <option>Pakistan</option>
              </select>
            </div>
          )
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between mt-6 items-center">
        {editingStore && (
          <button onClick={handleDeleteStore} className="text-red-600 flex items-center gap-1">
            <Trash2 /> Delete
          </button>
        )}
        <div className="flex gap-3 ml-auto">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  )
}

export default PosStore
