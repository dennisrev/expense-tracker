<template>
  <div class="summary-dashboard">
    <h2>Samenvatting</h2>

    <div class="summary-content">
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
import { computed } from 'vue'
import { useExpenses } from '../composables/useExpenses'
import type { Category } from '../composables/types'

const { expenses } = useExpenses()

const total = computed(() => {
  return expenses.value.reduce((sum, exp) => sum + exp.amount, 0)
})

const breakdown = computed(() => {
  const categories: Category[] = ['Food', 'Transport', 'Entertainment', 'Other']
  return categories.map((cat) => ({
    category: cat,
    amount: expenses.value
      .filter((exp) => exp.category === cat)
      .reduce((sum, exp) => sum + exp.amount, 0),
  }))
})
</script>