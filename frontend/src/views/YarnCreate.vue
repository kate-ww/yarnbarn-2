<template>
  <div>
    <div class="mb-6">
      <h2 class="text-3xl font-bold text-blue-400">Add New Yarn</h2>
      <p class="text-gray-400 mt-2">Fill in the details below to add a new yarn to your inventory.</p>
    </div>

    <form @submit.prevent="submitForm" class="bg-gray-800 p-6 rounded-lg">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Required Fields -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-2">Brand *</label>
          <input
            v-model="form.brand"
            type="text"
            required
            class="input-field w-full"
            placeholder="e.g., Red Heart"
          >
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
          {{ submitting ? 'Creating...' : 'Create Yarn' }}
        </button>
        <router-link to="/" class="btn-secondary">Cancel</router-link>
      </div>

      <!-- Error Display -->
      <div v-if="error" class="mt-4 bg-red-900 border border-red-700 text-red-200 p-4 rounded">
        <p>{{ error }}</p>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'YarnCreate',
  setup() {
    const router = useRouter()
    const form = ref({
      user_id: 1, // In a real app, this would come from authentication
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
    const error = ref('')

    const submitForm = async () => {
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
        const response = await fetch('/api/yarn', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form.value)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to create yarn')
        }

        // Redirect to list on success
        router.push('/')
      } catch (err) {
        error.value = err.message
        console.error('Error creating yarn:', err)
      } finally {
        submitting.value = false
      }
    }

    return {
      form,
      submitting,
      error,
      submitForm
    }
  }
}
</script>
