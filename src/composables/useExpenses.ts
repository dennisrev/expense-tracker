import type { Category, Expense } from './types'

// Initialize expenses from LocalStorage or fallback to empty array
let storedExpenses: string | null
try {
  storedExpenses = localStorage.getItem('expenses')
} catch (e) {
  storedExpenses = null
}
const initialExpenses: Expense[] = storedExpenses
  ? JSON.parse(storedExpenses)
  : []

// Reactive state
const expenses: Expense[] = initialExpenses

// State
export interface UseExpensesState {
  expenses: Expense[]
  loading: boolean
  error: string | null
}

// Helper: generate unique ID
const generateId = (): string => crypto.randomUUID()

// Helper: persist expenses to LocalStorage with error handling
const persistExpenses = (expenses: Expense[]): void => {
  try {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  } catch (e) {
    console.error('LocalStorage error: could not persist expenses', e)
    // Fallback: silently continue with in-memory state only
  }
}

// Actions
export const addExpense = (
  description: string,
  amount: number,
  category: Category,
  date: string = new Date().toISOString().split('T')[0]
): Expense => {
  if (amount <= 0) {
    throw new Error('Amount must be greater than 0')
  }

  if (description.trim().length < 3) {
    throw new Error('Description must be at least 3 characters')
  }

  if (description.trim().length > 100) {
    throw new Error('Description must be at most 100 characters')
  }

  const newExpense: Expense = {
    id: generateId(),
    date,
    amount,
    category,
    description: description.trim(),
  }

  // Update state and persist
  // In a real composable, this would use Vue's reactive state
  // For now, we return the new expense and expect the caller to manage state
  persistExpenses([newExpense])

  return newExpense
}

// Delete expense with confirm dialog
export const deleteExpense = (id: string): Expense | null => {
  if (!confirm("Verwijder deze uitgave?")) return null

  const index = expenses.findIndex((exp) => exp.id === id)
  if (index === -1) return null

  const [deleted] = expenses.splice(index, 1)
  persistExpenses(expenses)
  return deleted
}

// Update expense with validation
export const updateExpense = (
  id: string,
  updates: Partial<Expense>
): Expense | null => {
  const index = expenses.findIndex((exp) => exp.id === id)
  if (index === -1) return null

  const existing = expenses[index]

  // Validate updated fields
  if (updates.amount !== undefined && updates.amount <= 0) {
    throw new Error('Amount must be greater than 0')
  }

  if (updates.description !== undefined) {
    const desc = updates.description.trim()
    if (desc.length < 3) {
      throw new Error('Description must be at least 3 characters')
    }
    if (desc.length > 100) {
      throw new Error('Description must be at most 100 characters')
    }
  }

  // Merge updates with existing expense
  const updated: Expense = {
    ...existing,
    ...updates,
    description: updates.description ? updates.description.trim() : existing.description,
    amount:
      updates.amount !== undefined ? updates.amount : existing.amount,
  }

  expenses[index] = updated
  persistExpenses(expenses)
  return updated
}

// Export type and state for use in components
export { initialExpenses }