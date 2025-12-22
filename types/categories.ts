// GET type for a category
export type GetCategory = {
  categoryId: number
  name: string
  color: string
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
}

// CreateCategory type
export type CreateCategory = {
  name: string
  color: string
}

// UpdateCategory type
export type UpdateCategory = {
  name?: string
  color?: string
}
