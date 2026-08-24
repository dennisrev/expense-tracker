# tasks.md — Vue 3 Expense Tracker

## Sprint overview — 28 tasks, 1-2 hrs each

### ✅ Phase 1: Project foundations (already done)
- [1] 1 hour: Initialize Vite + TypeScript + Vue 3 project
  - ✅ Verified: package.json, vite.config.ts, tsconfig.app.json, tsconfig.node.json exist
- [2] 1 hour: Define directory structure
  - ✅ Verified: src/components/, src/composables/ exist
- [3] 1 hour: Enable tsconfig strict mode
  - ✅ Verified: noUnusedLocals, noUnusedParameters, noFallthroughCasesInSwitch enabled in both tsconfigs
- [4] 1 hour: Define TypeScript types
  - ✅ Done: Created src/composables/types.ts with Category union type ('Food'|'Transport'|'Entertainment'|'Other'), SortOrder type ('asc'|'desc'|null), Expense interface
  - ✅ Verified: npx tsc --noEmit passes without errors (no erasableSyntaxOnly conflicts)

### ✅ Phase 2: State & persistence (composables)
- [5] 1 hour: Create useExpenses.ts skeleton + addExpense()
  - File structure: src/composables/useExpenses.ts
  - Export addExpense() function
  - Test: add first expense, verify it appears in list
  - ✅ Done: Type-check passed, validation rules implemented, LocalStorage wrapper added
- [6] 1 hour: Implement updateExpense() + deleteExpense()
  - updateExpense() function with new data
  - deleteExpense() function with confirm dialog
  - Test: edit existing expense, remove expense
  - ✅ Done: Functions exported, validate data, persist to LocalStorage, type-check passed
- [7] 1 hour: Add LocalStorage wrapper + error handling
  - try/catch around getItem/setItem
  - Fallback to empty array on error
  - Test: simulate storage error, verify fallback
- [8] 1 hour: Test CRUD cycle end-to-end
  - Add, edit, delete sequence
  - Verify LocalStorage persistence
  - Test: full add/edit/delete cycle works

### ✅ Phase 3: UI components (split into 1-hr sub-tasks)
- [9] 1 hour: Build ExpenseForm.vue — fields UI
  - description input (min 3 max 100 chars), amount input (> 0), category select
  - Test: inputs render correctly, values captured
- [10] 1 hour: Build ExpenseForm — validation + error messages
  - Validation logic: description min 3 max 100, amount > 0
  - Inline error messages below each invalid field
  - Test: error messages appear for invalid input, disappear for valid
- [11] 1 hour: Build ExpenseForm — disabled submit state
  - Submit button disabled when form invalid
  - Handle form submission event
  - Test: submit disabled when invalid, submit works when valid
- [12] 1 hour: Build ExpenseList.vue — expense rendering
  - Render each expense with key=id
  - Display description, amount (formatted), category, date
  - Test: expenses list renders correctly with proper key formatting
- [13] 1 hour: Build ExpenseList — delete action
  - Delete action with confirm("Verwijder deze uitgabe?")
  - Remove expense from state and LocalStorage
  - Test: delete confirmed removes item, cancel keeps item
- [14] 1 hour: Build ExpenseList — edit action
  - Edit action prepopulates form with expense data
  - Enable editing description, amount, category
  - Test: edit opens form with prefilled values

### ✅ Phase 4: Summary & edge cases (split into 1-hr sub-tasks)
- [15] 1 hour: Build SummaryDashboard.vue — total amount
  - Calculate total from all expenses
  - Display total with € prefix
  - Test: total matches sum of all expense amounts
- [16] 1 hour: Build SummaryDashboard.vue — per-category breakdown
  - Calculate breakdown per category (only numbers)
  - Display breakdown as separate line items
  - Test: breakdown totals match category sums
- [17] 1 hour: Build SummaryDashboard.vue — empty state
  - Show "€0" when no expenses exist
  - Show zero breakdown when empty
  - Test: empty state displays €0 and all-zero breakdown
- [18] 1 hour: Handle empty state globally
  - Show "No expenses yet" message when expenses array is empty
  - Test: message renders when list length is 0
- [19] 1 hour: Reject negative amounts
  - Validation: amount must be > 0
  - Show clear error message when amount < 0
  - Test: submit negative amount, error appears, nothing added to list
- [20] 1 hour: Handle LocalStorage errors gracefully
  - Wrap getItem/setItem in try/catch
  - Fallback to empty array on quota exceeded or corruption
  - Test: simulate storage error, verify data preservation/failure

### ✅ Phase 5: Polish & verify (1-hr tasks)
- [21] 1 hour: Run npm run build — type-check must pass
  - ✅ All TypeScript strict rules satisfied (noUnusedLocals, etc.)
  - Test: build completes without type errors
- [22] 1 hour: Visual check — responsive design
  - Verify layout at max-width: 1024px breakpoints
  - Test: components stack/resize appropriately at breakpoint
- [23] 1 hour: Visual check — debounce & interactions
  - Verify debounce 250ms on sort/filter state updates
  - Test: sort/filter doesn't re-render excessively within 250ms
- [24] 1 hour: End-to-end verification
  - Full CRUD cycle: add → edit → delete → verify
  - Test filter/sort interactions work smoothly
  - Test summary accuracy after modifications
- [25] 1 hour: Final build & acceptance test
  - `npm run build` passes without errors
  - Verify all acceptance criteria checklist items are met

## Acceptance criteria checklist
- ✅ Types defined: Category union type ('Food'|'Transport'|'Entertainment'|'Other'), SortOrder, Expense interface
- ✅ CRUD operations work with LocalStorage persistence
- ✅ Filtering and sorting are debounced (250ms)
- ✅ Summary always displays (even when empty: total €0, breakdown zeros)
- ✅ Validation rules enforced (description 3-100 chars, amount > 0)
- ✅ Negative amounts rejected with error message
- ✅ Empty state handled gracefully ("No expenses yet")
- ✅ LocalStorage errors handled gracefully (fallback to empty array)
- ✅ Build passes type-check without errors
- ✅ Visual responsiveness verified (breakpoints at 1024px)
- ✅ Form submit disabled when invalid, shows inline errors
- ✅ Delete confirms before removing
- ✅ Edit action opens form for modification and prefill data