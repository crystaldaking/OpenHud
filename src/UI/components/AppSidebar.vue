<script setup lang="ts">
import { GalleryVerticalEnd, Settings, User, Users, CirclePlus, LayoutGrid } from 'lucide-vue-next'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import SidebarHeader from '@/components/ui/sidebar/SidebarHeader.vue';

// Menu items.
const items = [
    {
        title: 'Dashboard',
        url: '/',
        icon: LayoutGrid,
    },
    {
        title: 'Matches',
        url: '/matches',
        icon: CirclePlus,
    },
    {
    title: 'Players',
    url: '/players',
    icon: User,
    },
    {
    title: 'Teams',
    url: '/teams',
    icon: Users,
    },
    {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
    },
]

const isActive = (url: string) => {
  return window.location.pathname === url;
}
</script>

<template>
  <Sidebar variant="floating" collapsible="icon">
    <SidebarHeader>
        <SidebarMenu>
        <SidebarMenuItem>
            <SidebarMenuButton size="lg">
            <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd class="size-4" />
            </div>
            <div class="flex flex-col gap-0.5 leading-none">
                <span class="font-semibold">OpenHud</span>
                <span class="">v3.0.8</span>
            </div>
            </SidebarMenuButton>
        </SidebarMenuItem>
        </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in items" :key="item.title">
              <SidebarMenuButton as-child :is-active="isActive(item.url)">
                <RouterLink :to="item.url">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
