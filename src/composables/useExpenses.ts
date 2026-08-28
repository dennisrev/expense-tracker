import { ref } from 'vue'
import type { Category, Expense } from './types'

const STORAGE_KEY = 'expenses'

function loadExpenses(): Expense[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveExpenses(expenses: Expense[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
  } catch (e) {
    console.error('LocalStorage error: could not persist expenses', e)
  }
}

const generateId = (): string => crypto.randomUUID()

const expenses = ref<Expense[]>(loadExpenses())
const loading = ref(false)
const error = ref<string | null>(null)

function validateAmount(amount: number): void {
  if (amount <= 0) throw new Error('Amount must be greater than 0')
}

function validateDescription(description: string): void {
  const trimmed = description.trim()
  if (trimmed.length < 3) throw new Error('Description must be at least 3 characters')
  if (trimmed.length > 100) throw new Error('Description must be at most 100 characters')
}

export function useExpenses() {
  function addExpense(
    description: string,
    amount: number,
    category: Category,
    date: string = new Date().toISOString().split('T')[0]
  ): Expense {
    validateAmount(amount)
    validateDescription(description)

    const newExpense: Expense = {
      id: generateId(),
      date,
      amount,
      category,
      description: description.trim(),
    }

    expenses.value.push(newExpense)
    saveExpenses(expenses.value)
    return newExpense
  }

  function updateExpense(id: string, updates: Partial<Expense>): Expense | null {
    const index = expenses.value.findIndex((exp) => exp.id === id)
    if (index === -1) return null

    const existing = expenses.value[index]

    if (updates.amount !== undefined) validateAmount(updates.amount)
    if (updates.description !== undefined) validateDescription(updates.description)

    const updated: Expense = {
      ...existing,
      ...updates,
      description: updates.description ? updates.description.trim() : existing.description,
      amount: updates.amount !== undefined ? updates.amount : existing.amount,
    }

    expenses.value[index] = updated
    saveExpenses(expenses.value)
    return updated
  }

  function deleteExpense(id: string): Expense | null {
    const index = expenses.value.findIndex((exp) => exp.id === id)
    if (index === -1) return null

    const [deleted] = expenses.value.splice(index, 1)
    saveExpenses(expenses.value)
    return deleted
  }

  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
  }
}

export type { Expense, Category }