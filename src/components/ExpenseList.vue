<template>
<div class="expense-list">
  <h2>Uitgaven</h2>

  <p v-if="localExpenses.length === 0" class="empty-state">Geen uitgaven yet</p>

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
      <tr v-for="expense in localExpenses" :key="expense.id">
        <td>{{ expense.description }}</td>
        <td>{{ expense.amount }} €</td>
        <td>{{ expense.category }}</td>
        <td>{{ expense.date }}</td>
        <td>
          <button @click="handleDelete(expense.id)" class="btn-delete">Verwijderen</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Expense type definition
interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
}

// Local expense store
const localExpenses = ref<Expense[]>([])

// Delete expense with confirmation (per task 7 spec: confirm("Verwijder deze uitgave?"))
const handleDelete = (id: string) => {
  if (confirm('Verwijder deze uitgabe?')) {
    // Remove from local state
    localExpenses.value = localExpenses.value.filter((e) => e.id !== id)
    // Persist to LocalStorage
    try {
      localStorage.setItem('expenses', JSON.stringify(localExpenses.value))
    } catch (e) {
      console.error('LocalStorage error:', e)
    }
  }
}
</script>