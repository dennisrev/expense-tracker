export type Category = 'Food' | 'Transport' | 'Entertainment' | 'Other'

export type SortOrder = 'asc' | 'desc' | null

export interface Expense {
  id: string
  date: string
  amount: number
  category: Category
  description: string
}