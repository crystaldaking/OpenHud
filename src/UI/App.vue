<script setup lang="ts">
import SidebarProvider from '@/components/ui/sidebar/SidebarProvider.vue';
import SidebarTrigger from '@/components/ui/sidebar/SidebarTrigger.vue';
import AppSidebar from './components/AppSidebar.vue';
import { RouterView } from 'vue-router';
</script>

<template>
    <SidebarProvider>
        <AppSidebar/>
        <main>
        <SidebarTrigger />
        <slot />
        <RouterView />
        </main>
        <RouterView />
    </SidebarProvider>
</template>

