import { ref, computed, watch } from 'vue'
import type { Category, SortOrder, Expense } from './types'

const DEBOUNCE_MS = 250

export function useFilters(allExpenses: Expense[]) {
  const searchQuery = ref('')
  const selectedCategory = ref<Category | 'All'>('All')
  const sortOrder = ref<SortOrder>(null)

  const debouncedSearchQuery = ref('')
  const debouncedCategory = ref<Category | 'All'>('All')
  const debouncedSortOrder = ref<SortOrder>(null)

  let searchTimeout: ReturnType<typeof setTimeout> | null = null
  let categoryTimeout: ReturnType<typeof setTimeout> | null = null
  let sortTimeout: ReturnType<typeof setTimeout> | null = null

  function debounceUpdate<T>(
    source: { value: T },
    target: { value: T },
    timeoutRef: { current: ReturnType<typeof setTimeout> | null }
  ): void {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      target.value = source.value
    }, DEBOUNCE_MS)
  }

  watch(searchQuery, () => debounceUpdate(searchQuery, debouncedSearchQuery, { current: searchTimeout }))
  watch(selectedCategory, () => debounceUpdate(selectedCategory, debouncedCategory, { current: categoryTimeout }))
  watch(sortOrder, () => debounceUpdate(sortOrder, debouncedSortOrder, { current: sortTimeout }))

  const filteredExpenses = computed(() => {
    let result = [...allExpenses]

    const query = debouncedSearchQuery.value.toLowerCase().trim()
    if (query) {
      result = result.filter((exp) =>
        exp.description.toLowerCase().includes(query) ||
        exp.category.toLowerCase().includes(query)
      )
    }

    if (debouncedCategory.value !== 'All') {
      result = result.filter((exp) => exp.category === debouncedCategory.value)
    }

    if (debouncedSortOrder.value === 'asc') {
      result.sort((a, b) => a.amount - b.amount)
    } else if (debouncedSortOrder.value === 'desc') {
      result.sort((a, b) => b.amount - a.amount)
    }

    return result
  })

  function clearFilters(): void {
    searchQuery.value = ''
    selectedCategory.value = 'All'
    sortOrder.value = null
  }

  return {
    searchQuery,
    selectedCategory,
    sortOrder,
    filteredExpenses,
    clearFilters,
  }
}

export type { Category, SortOrder }