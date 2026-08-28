<template>
  <div class="expense-form">
    <h2>{{ isEditing ? 'Uitgave bewerken' : 'Nieuwe uitgave' }}</h2>

    <div class="form-group">
      <label for="description">Omschrijving</label>
      <input
        id="description"
        type="text"
        v-model="description"
        placeholder="Omschrijving minimaal 3 tekens"
        required
      />
      <p class="error" v-if="descriptionError">{{ descriptionError }}</p>
    </div>

    <div class="form-group">
      <label for="amount">Bedrag</label>
      <input
        id="amount"
        type="number"
        v-model.number="amount"
        placeholder="Bedrag > 0"
        required
      />
      <p class="error" v-if="amountError">{{ amountError }}</p>
    </div>

    <div class="form-group">
      <label for="category">Categorie</label>
      <select id="category" v-model="category">
        <option value="Food">Voedsel</option>
        <option value="Transport">Vervoer</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Other">Overig</option>
      </select>
    </div>

    <div class="form-group">
      <label for="date">Datum</label>
      <input
        id="date"
        type="date"
        v-model="date"
      />
    </div>

    <p class="error" v-if="formError">{{ formError }}</p>

    <div class="actions">
      <button
        type="button"
        class="btn-cancel"
        @click="cancel"
        :disabled="isSaving"
      >Annuleren</button>
      <button
        type="button"
        :disabled="isSaving || !validateForm()"
        class="btn-save"
        @click="save"
      >
        <span v-if="isSaving">Opslaan...</span>
        <span v-else>{{ isEditing ? 'Bijwerken' : 'Opslaan' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category, Expense } from '../composables/types'
import { ref, watch } from 'vue'
import { useExpenses } from '../composables/useExpenses'

interface Props {
  expenseToEdit?: Expense | null
}

const props = defineProps<Props>()

const { addExpense, updateExpense } = useExpenses()

const description = ref<string>('')
const amount = ref<number>(0)
const category = ref<Category>('Food')
const date = ref<string>(new Date().toISOString().split('T')[0])

const descriptionError = ref<string>('')
const amountError = ref<string>('')
const formError = ref<string>('')

const isSaving = ref(false)
const isEditing = ref(false)
let editingId: string | null = null

function loadExpense(expense: Expense) {
  description.value = expense.description
  amount.value = expense.amount
  category.value = expense.category
  date.value = expense.date
  editingId = expense.id
  isEditing.value = true
}

function clearForm() {
  description.value = ''
  amount.value = 0
  category.value = 'Food'
  date.value = new Date().toISOString().split('T')[0]
  descriptionError.value = ''
  amountError.value = ''
  formError.value = ''
  editingId = null
  isEditing.value = false
}

watch(() => props.expenseToEdit, (newExpense) => {
  if (newExpense) {
    loadExpense(newExpense)
  } else {
    clearForm()
  }
}, { immediate: true })

const validateDescription = (): boolean => {
  const value = description.value.trim()
  if (value.length < 3) {
    descriptionError.value = 'Omschrijving moet minimaal 3 tekens bevatten'
    return false
  }
  if (value.length > 100) {
    descriptionError.value = 'Omschrijving mag maximaal 100 tekens bevatten'
    return false
  }
  descriptionError.value = ''
  return true
}

const validateAmount = (): boolean => {
  if (amount.value <= 0) {
    amountError.value = 'Bedrag moet groter zijn dan 0'
    return false
  }
  amountError.value = ''
  return true
}

const validateForm = (): boolean => {
  const validDesc = validateDescription()
  const validAmt = validateAmount()
  formError.value = ''
  return validDesc && validAmt
}

const save = async () => {
  if (!validateForm()) return

  isSaving.value = true
  formError.value = ''

  try {
    if (isEditing.value && editingId) {
      updateExpense(editingId, {
        description: description.value.trim(),
        amount: amount.value,
        category: category.value,
        date: date.value,
      })
    } else {
      addExpense(
        description.value.trim(),
        amount.value,
        category.value,
        date.value
      )
    }
    clearForm()
  } catch (e) {
    formError.value = (e as Error).message || 'Onbekende fout bij opslaan'
    console.error('Save error:', e)
  } finally {
    isSaving.value = false
  }
}

const cancel = () => {
  clearForm()
}
</script>