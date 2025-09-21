<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-sm">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-14 items-center justify-between">
          <div class="flex items-center gap-6">
            <h1 class="text-lg font-semibold text-slate-800">Charts App</h1>
            <router-link class="text-slate-600 hover:text-slate-900" to="/apex">Dashboard</router-link>
          </div>
        </div>
      </div>
    </nav>
    <main class="py-6">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

onMounted(() => {
  if (route.path === '/') {
    router.replace('/apex');
  }
});
</script>
  