<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);
</script>

<template>
  <div class="flex h-screen w-full flex-col items-center justify-center space-y-4">
    <h1 class="text-5xl font-bold text-blue-400 drop-shadow-lg">
      OpenHud
    </h1>
    <p class="text-xl text-gray-400">
      Electron + Vue 3 + Tailwind v4
    </p>
    
    <div class="p-6 bg-slate-800 rounded-xl shadow-xl border border-slate-700">
      <button 
        @click="count++"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition text-white font-semibold cursor-pointer"
      >
        Clicks: {{ count }}
      </button>
    </div>
  </div>
</template>