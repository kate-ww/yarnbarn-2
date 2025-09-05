<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-blue-400">Yarn Inventory</h2>
      <router-link to="/create" class="btn-primary">Add New Yarn</router-link>
    </div>

    <!-- Search/Filter Section -->
    <div class="mb-6 bg-gray-800 p-4 rounded">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          v-model="filters.brand"
          @input="debouncedSearch"
          type="text"
          placeholder="Filter by brand..."
          class="input-field"
        >
        <input
          v-model="filters.color"
          @input="debouncedSearch"
          type="text"
          placeholder="Filter by color..."
          class="input-field"
        >
        <button @click="clearFilters" class="btn-secondary">Clear Filters</button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-400">Loading yarns...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-900 border border-red-700 text-red-200 p-4 rounded mb-6">
      <p>{{ error }}</p>
      <button @click="fetchYarns" class="btn-secondary mt-2">Retry</button>
    </div>

    <!-- Yarn List -->
    <div v-else-if="yarns.length > 0" class="grid gap-4">
      <div
        v-for="yarn in yarns"
        :key="yarn.id"
        class="bg-gray-800 p-6 rounded-lg shadow-md"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="text-xl font-semibold text-white">{{ yarn.brand }} - {{ yarn.name }} - {{ getYarnStatus(yarn) }}</h3>
            <div class="mt-2 grid grid-cols-2 md:grid-cols-5 gap-2 text-sm text-gray-300">
              <div><strong>Color:</strong> {{ yarn.color || 'N/A' }}</div>
              <div><strong>Start Length:</strong> {{ yarn.start_len + " yds" || 'N/A' }}</div>
              <div><strong>Start Weight:</strong> {{ yarn.start_weight }}g</div>
              <div><strong>Current Weight:</strong> {{ yarn.curr_weight }}g</div>
              <div><strong>Current Length:</strong> {{ calculateYarnCurrLen(yarn).toFixed(1) }} yds</div>
            </div>
            <div class="mt-2 text-sm text-gray-400">
              <strong>Added:</strong> {{ formatDate(yarn.date_added) }}
              <span v-if="yarn.upc" class="ml-4"><strong>UPC:</strong> {{ yarn.upc }}</span>
            </div>
          </div>
          <div class="flex space-x-2 ml-4">
            <router-link :to="`/edit/${yarn.id}`" class="btn-secondary text-sm">Edit</router-link>
            <button @click="confirmDelete(yarn)" class="btn-danger text-sm">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <p class="text-gray-400 text-lg">No yarns found.</p>
      <router-link to="/create" class="btn-primary mt-4">Add Your First Yarn</router-link>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
        <h3 class="text-xl font-bold mb-4">Confirm Delete</h3>
        <p class="mb-6">Are you sure you want to delete "{{ deleteYarn?.brand }} - {{ deleteYarn?.name }}"?</p>
        <div class="flex space-x-4">
          <button @click="deleteYarn" :disabled="deleting" class="btn-danger flex-1">
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
          <button @click="cancelDelete" class="btn-secondary flex-1">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'YarnList',
  setup() {
    const yarns = ref([])
    const loading = ref(false)
    const error = ref('')
    const filters = ref({ brand: '', color: '' })
    const showDeleteModal = ref(false)
    const deleteYarn = ref(null)
    const deleting = ref(false)

    // Debounce search to avoid too many API calls
    let searchTimeout = null
    const debouncedSearch = () => {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(fetchYarns, 300)
    }

    const fetchYarns = async () => {
      loading.value = true
      error.value = ''

      try {
        const queryParams = new URLSearchParams()
        if (filters.value.brand) queryParams.append('brand', filters.value.brand)
        if (filters.value.color) queryParams.append('color', filters.value.color)

        const response = await fetch(`/api/yarn?${queryParams}`)
        if (!response.ok) throw new Error('Failed to fetch yarns')

        yarns.value = await response.json()
      } catch (err) {
        error.value = err.message
        console.error('Error fetching yarns:', err)
      } finally {
        loading.value = false
      }
    }

    const clearFilters = () => {
      filters.value = { brand: '', color: '' }
      fetchYarns()
    }

    const confirmDelete = (yarn) => {
      deleteYarn.value = yarn
      showDeleteModal.value = true
    }

    const cancelDelete = () => {
      showDeleteModal.value = false
      deleteYarn.value = null
    }

    const performDelete = async () => {
      if (!deleteYarn.value) return

      deleting.value = true
      try {
        const response = await fetch(`/api/yarn/${deleteYarn.value.id}`, {
          method: 'DELETE'
        })

        if (!response.ok) throw new Error('Failed to delete yarn')

        // Remove from local list
        yarns.value = yarns.value.filter(y => y.id !== deleteYarn.value.id)
        showDeleteModal.value = false
        deleteYarn.value = null
      } catch (err) {
        error.value = err.message
        console.error('Error deleting yarn:', err)
      } finally {
        deleting.value = false
      }
    }

    const calculateYarnCurrLen = (yarn) => {
      const { start_len, start_weight, curr_weight } = yarn
      if (!start_weight || start_weight === 0) {
        console.warn('Starting weight is zero or undefined, cannot calculate current length')
        return 0
      }
      return start_len * (curr_weight / start_weight)
    }

    const getYarnStatus = (yarn) => {
      const { start_weight, curr_weight } = yarn
      if (curr_weight === 0 || curr_weight === null) {
        return 'Empty'
      }
      if (start_weight === curr_weight) {
        return 'Full'
      }
      return 'Partial'
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString()
    }

    onMounted(fetchYarns)

    return {
      yarns,
      loading,
      error,
      filters,
      showDeleteModal,
      deleteYarn,
      deleting,
      debouncedSearch,
      fetchYarns,
      clearFilters,
      confirmDelete,
      cancelDelete,
      deleteYarn: performDelete,
      formatDate,
      calculateYarnCurrLen,
      getYarnStatus
    }
  }
}
</script>