<template>
  <div id="app" class="min-h-screen bg-gray-900 text-white">
    <nav class="bg-gray-800 p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold text-blue-400">Yarn Inventory</h1>
        <router-link to="/" class="text-gray-300 hover:text-white">Home</router-link>
      </div>
    </nav>

    <main class="container mx-auto p-4">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* Additional global styles can go here */
</style>