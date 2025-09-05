<template>
  <div>
    <div class="mb-6">
      <h2 class="text-3xl font-bold text-blue-400">Edit Yarn</h2>
      <p class="text-gray-400 mt-2">Update the details for this yarn.</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-400">Loading yarn details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error && !yarn" class="bg-red-900 border border-red-700 text-red-200 p-4 rounded mb-6">
      <p>{{ error }}</p>
      <router-link to="/" class="btn-secondary mt-2">Back to List</router-link>
    </div>

    <!-- Edit Form -->
    <form v-else-if="yarn" @submit.prevent="submitForm" class="bg-gray-800 p-6 rounded-lg">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Required Fields -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-2">Brand *</label>
          <select v-model="selectedBrand" :disabled="brandsLoading" class="input-field w-full" required>
            <option value="" disabled>Select a brand</option>
            <option v-for="brand in brands" :key="brand.id" :value="brand">{{ brand.name }}</option>
            <option value="new">Add New Brand</option>
          </select>
          <div v-if="selectedBrand === 'new'" class="mt-2">
            <input v-model="newBrand" type="text" required class="input-field w-full" placeholder="Enter new brand name">
          </div>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-2">Name *</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="input-field w-full"
            placeholder="e.g., Super Saver"
          >
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Start Length (yards) *</label>
          <input
            v-model.number="form.start_len"
            type="number"
            required
            min="1"
            class="input-field w-full"
            placeholder="e.g., 364"
          >
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Start Weight (grams) *</label>
          <input
            v-model.number="form.start_weight"
            type="number"
            required
            min="1"
            class="input-field w-full"
            placeholder="e.g., 198"
          >
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Current Weight (grams) *</label>
          <input
            v-model.number="form.curr_weight"
            type="number"
            required
            min="0"
            class="input-field w-full"
            placeholder="e.g., 198"
          >
        </div>

        <!-- Optional Fields -->
        <div>
          <label class="block text-sm font-medium mb-2">Color</label>
          <input
            v-model="form.color"
            type="text"
            class="input-field w-full"
            placeholder="e.g., Blue"
          >
        </div>

        <!-- <div>
          <label class="block text-sm font-medium mb-2">Count</label>
          <input
            v-model.number="form.count"
            type="number"
            min="1"
            class="input-field w-full"
            placeholder="e.g., 1"
          >
        </div> -->

        <div>
          <label class="block text-sm font-medium mb-2">UPC</label>
          <input
            v-model="form.upc"
            type="text"
            class="input-field w-full"
            placeholder="e.g., 123456789012"
          >
        </div>

        <!-- <div>
          <label class="block text-sm font-medium mb-2">Status</label>
          <select v-model="form.status" class="input-field w-full">
            <option value="Full">Full</option>
            <option value="Partial">Partial</option>
            <option value="Empty">Empty</option>
          </select>
        </div> -->
      </div>

      <!-- Form Actions -->
      <div class="mt-8 flex space-x-4">
        <button
          type="submit"
          :disabled="submitting"
          class="btn-primary flex-1 md:flex-none"
        >
          {{ submitting ? 'Updating...' : 'Update Yarn' }}
        </button>
        <router-link to="/" class="btn-secondary">Cancel</router-link>
      </div>

      <!-- Error Display -->
      <div v-if="error" class="mt-4 bg-red-900 border border-red-700 text-red-200 p-4 rounded">
        <p>{{ error }}</p>
      </div>

      <!-- Fetch Error Display -->
      <div v-if="brandsError" class="mt-4 bg-red-900 border border-red-700 text-red-200 p-4 rounded">
        <p>{{ brandsError }}</p>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'YarnEdit',
  props: ['id'],
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    const yarn = ref(null)
    const loading = ref(false)
    const error = ref('')
    const form = ref({
      brand: '',
      name: '',
      color: '',
      count: null,
      start_len: null,
      start_weight: null,
      curr_weight: null,
      upc: '',
      status: 'Full'
    })
    const submitting = ref(false)
    const brands = ref([])
    const selectedBrand = ref(null)
    const newBrand = ref('')
    const brandsLoading = ref(false)
    const brandsError = ref('')

    const fetchYarn = async () => {
      const yarnId = props.id || route.params.id
      if (!yarnId) {
        error.value = 'No yarn ID provided'
        return
      }

      loading.value = true
      error.value = ''

      try {
        const response = await fetch(`/api/yarn/${yarnId}`)
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Yarn not found')
          }
          throw new Error('Failed to fetch yarn')
        }

        yarn.value = await response.json()
        // Populate form with existing data
        form.value = { ...yarn.value }
      } catch (err) {
        error.value = err.message
        console.error('Error fetching yarn:', err)
      } finally {
        loading.value = false
      }
    }

    const fetchBrands = async () => {
      brandsLoading.value = true
      brandsError.value = ''
      try {
        const response = await fetch('/api/yarn/brands')
        if (!response.ok) throw new Error('Failed to fetch brands')
        brands.value = await response.json()
      } catch (err) {
        brandsError.value = 'Failed to load brands'
        console.error('Error fetching brands:', err)
      } finally {
        brandsLoading.value = false
      }
    }

    const submitForm = async () => {
      // Brand selection validation
      if (!selectedBrand.value) {
        error.value = 'Please select a brand.'
        return
      }

      if (selectedBrand.value === 'new') {
        if (!newBrand.value.trim()) {
          error.value = 'New brand name is required.'
          return
        }
        const exists = brands.value.some(b => b.name.toLowerCase() === newBrand.value.trim().toLowerCase())
        if (exists) {
          error.value = 'Brand already exists'
          return
        }
        form.value.brand = newBrand.value.trim()
      } else {
        form.value.brand = selectedBrand.value.name
      }

      // Basic client-side validation
      if (!form.value.brand.trim() || !form.value.name.trim()) {
        error.value = 'Brand and name are required.'
        return
      }

      if (!form.value.start_len || !form.value.start_weight || !form.value.curr_weight) {
        error.value = 'Start length, start weight, and current weight are required.'
        return
      }

      submitting.value = true
      error.value = ''

      try {
        const response = await fetch(`/api/yarn/${yarn.value.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form.value)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to update yarn')
        }

        // Redirect to list on success
        router.push('/')
      } catch (err) {
        error.value = err.message
        console.error('Error updating yarn:', err)
      } finally {
        submitting.value = false
      }
    }

    onMounted(async () => {
      await Promise.all([fetchYarn(), fetchBrands()])
      if (yarn.value && brands.value.length > 0) {
        const foundBrand = brands.value.find(b => b.name === yarn.value.brand)
        if (foundBrand) {
          selectedBrand.value = foundBrand
        } else {
          selectedBrand.value = 'new'
          newBrand.value = yarn.value.brand
        }
      }
    })

    return {
      yarn,
      loading,
      error,
      form,
      submitting,
      brands,
      selectedBrand,
      newBrand,
      brandsLoading,
      brandsError,
      submitForm
    }
  }
}
</script>