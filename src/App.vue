<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ExpenseForm from './components/ExpenseForm.vue'
import ExpenseList from './components/ExpenseList.vue'
import SummaryDashboard from './components/SummaryDashboard.vue'
import type { Expense } from './composables/types'

const expenseToEdit = ref<Expense | null>(null)

onMounted(() => {
  window.addEventListener('edit-expense', ((e: CustomEvent<Expense>) => {
    expenseToEdit.value = e.detail
  }) as EventListener)
})
</script>

<template>
  <div class="app">
    <header>
      <h1>Uitgaven Tracker</h1>
    </header>
    <main>
      <section>
        <ExpenseForm :expenseToEdit="expenseToEdit" />
      </section>
      <section>
        <ExpenseList />
      </section>
      <section>
        <SummaryDashboard />
      </section>
    </main>
  </div>
</template>

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

header h1 {
  text-align: center;
  margin-bottom: 2rem;
}

main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
</style>