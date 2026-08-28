<template>
  <div class="expense-list">
    <h2>Uitgaven</h2>

    <div class="filters">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Zoeken op omschrijving of categorie..."
        class="filter-input"
      />
      <select v-model="selectedCategory" class="filter-select">
        <option value="All">Alle categorieën</option>
        <option value="Food">Voedsel</option>
        <option value="Transport">Vervoer</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Other">Overig</option>
      </select>
      <select v-model="sortOrder" class="filter-select">
        <option value="">Sorteren</option>
        <option value="asc">Bedrag: laag naar hoog</option>
        <option value="desc">Bedrag: hoog naar laag</option>
      </select>
      <button v-if="hasActiveFilters" @click="clearFilters" class="btn-clear">Filters wissen</button>
    </div>

    <p v-if="filteredExpenses.length === 0" class="empty-state">Geen uitgaven gevonden</p>

    <table v-else>
      <thead>
        <tr>
          <th>Omschrijving</th>
          <th>Bedrag</th>
          <th>Categorie</th>
          <th>Datum</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="expense in filteredExpenses" :key="expense.id">
          <td>{{ expense.description }}</td>
          <td>{{ expense.amount }} €</td>
          <td>{{ expense.category }}</td>
          <td>{{ expense.date }}</td>
          <td>
            <button @click="handleEdit(expense)" class="btn-edit">Bewerken</button>
            <button @click="handleDelete(expense.id)" class="btn-delete">Verwijderen</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useExpenses } from '../composables/useExpenses'
import { useFilters } from '../composables/useFilters'
import type { Expense } from '../composables/types'

const { expenses, deleteExpense } = useExpenses()
const { searchQuery, selectedCategory, sortOrder, filteredExpenses, clearFilters } = useFilters(expenses.value)

const hasActiveFilters = computed(() =>
  searchQuery.value.trim() !== '' ||
  selectedCategory.value !== 'All' ||
  sortOrder.value !== null
)

const handleEdit = (expense: Expense) => {
  window.dispatchEvent(new CustomEvent('edit-expense', { detail: expense }))
}

const handleDelete = (id: string) => {
  if (confirm('Verwijder deze uitgave?')) {
    deleteExpense(id)
  }
}
</script>