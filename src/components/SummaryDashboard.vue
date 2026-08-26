<template>
<div class="summary-dashboard">
  <h2>Samenvatting</h2>

  <div v-if="isEmpty" class="empty-state">
    <p>Geen uitgaven yet</p>
    <p>Totaal: {{ total }} €</p>
  </div>

  <div v-else class="summary-content">
    <div class="total-section">
      <h3>Totaal</h3>
      <p>{{ total }} €</p>
    </div>

    <div class="breakdown-section">
      <h3>Per categorie</h3>
      <ul>
        <li v-for="item in breakdown" :key="item.category">
          {{ item.category }}: {{ item.amount }} €
        </li>
      </ul>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
}

// Local state (in real app, this comes from useExpenses or Pinia)
const localExpenses = ref<Expense[]>([])

// Total berekening
const total = computed(() => {
  let sum = 0
  localExpenses.value.forEach((exp) => {
    sum += exp.amount
  })
  return sum
})

// Categorie-overschriidng
const breakdown = computed(() => {
  const result: { category: string; amount: number }[] = []
  const categories = ['Food', 'Transport', 'Entertainment', 'Other']
  categories.forEach((cat) => {
    const amount = localExpenses.value
      .filter((exp) => exp.category === cat)
      .reduce((sum, exp) => sum + exp.amount, 0)
    result.push({ category: cat, amount })
  })
  return result
})

// Lege staat vlag
const isEmpty = computed(() => localExpenses.value.length === 0)
</script>