# AGENTS.md — Vue 3 Expense Tracker

## Goal
Vue 3 + TypeScript + Vite expense tracker with CRUD, filtering, sorting, summary dashboard, and LocalStorage persistence.

## Data model
- `Expense`: { id: string, date: string, amount: number, category: Category, description: string }
- `Category`: `'Food' | 'Transport' | 'Entertainment' | 'Other'`
- `SortOrder`: `'asc' | 'desc' | null`

## Component architecture
- `src/components/ExpenseForm.vue` — create/edit form with inline validation
- `src/components/ExpenseList.vue` — display expenses with delete/edit actions, filtering, sorting
- `src/components/SummaryDashboard.vue` — total + breakdown per category
- `src/composables/useExpenses.ts` — reactive CRUD + LocalStorage logic (shared state)
- `src/composables/useFilters.ts` — 250ms debounced filter/sort state
- `src/composables/types.ts` — TypeScript types (single source of truth)

## TypeScript types
- Category: `'Food' | 'Transport' | 'Entertainment' | 'Other'`
- SortOrder: `'asc' | 'desc' | null`
- Expense interface as above

## Validation rules
- Required: description, amount, category
- Amount must be > 0
- Description min 3 chars, max 100 chars

## Edge cases
- LocalStorage: wrap `getItem/setItem` in try/catch; fallback to empty array on error
- Negative amounts: reject with error message

## UX rules
- Form submit: disabled if invalid; show inline error messages
- Delete: show `confirm("Verwijder deze uitgave?")` before removing
- Sort/filter: **250ms debounce** implemented in useFilters.ts
- Summary: always displays even when no expenses (total: €0, breakdown all zeros)

## Current state
- ✅ All components wired in App.vue
- ✅ Shared reactive state via useExpenses composable
- ✅ Filter/sort with 250ms debounce via useFilters composable
- ✅ Edit functionality (ExpenseForm supports edit mode, ExpenseList has edit button)
- ✅ Build passes (`npm run build`)

## Developer commands
- `npm run dev` — start Vite dev server
- `npm run build` — type-check then bundle with Vite (`vue-tsc -b && vite build`)
- `npm run preview` — preview production build

## What to avoid
- Do not mutate LocalStorage directly without going through useExpenses composable
- Do not skip validation on the form — disabled when invalid for a reason
- Do not forget the 250ms debounce on sort/filter state updates