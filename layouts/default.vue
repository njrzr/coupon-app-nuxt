<template>
  <div class="relative w-full h-screen select-none">
    <div class="fixed flex flex-col p-2 gap-2 items-center z-10 w-14 h-screen bg-blue-500">
      <NuxtLink :class="[links, { 'bg-gray-600': route.name !== 'login' && route.name !== 'logout', 'bg-red-600': route.name === 'logout' }, 'transition', 'duration-200', 'hover:bg-gray-400']" 
        v-for="route in $router.options.routes"
        :to="route.path"
        :title="titles[route.name]"
        :key="route.name"
        v-show="status === 'authenticated' && route.name !== 'login' && $route.name !== '_id/'">
        <i :class="[icons[route.name], 'text-white']"></i>
      </NuxtLink>

      <NuxtLink :class="[links, 'bg-gray-600', 'transition', 'duration-200', 'hover:bg-gray-400']"
        to="/"
        :title="titles['index']"
        key="index-unauth"
        v-show="status !== 'authenticated'">
        <i :class="[icons['index'], 'text-white']"></i>
      </NuxtLink>

      <NuxtLink :class="[links, 'bg-blue-600', 'transition', 'duration-200', 'hover:bg-blue-400']"
        to="/login"
        :title="titles['login']"
        key="login"
        v-show="status !== 'authenticated'">
        <i :class="[icons['login'], 'text-white']"></i>
      </NuxtLink>

      <button title="Cerrar Sesion" @click="signOut()" :class="[links, 'bg-red-600', 'transition', 'duration-200', 'active:bg-red-500', 'hover:bg-red-400']" v-show="status === 'authenticated'">
        <i :class="[icons['logout'], 'text-white']"></i>
      </button>
    </div>
    <slot />
    <div class="fixed bottom-0 right-0 px-4 py-1 rounded-tl-lg bg-teal-300">ZERO + PLUS &copy; 2023</div>
  </div>
</template>

<script setup lang="ts">
  const { status, signOut } = useSession()
  const links: string = "relative flex justify-center items-center overflow-hidden w-10 h-10 rounded"

  interface Indexed {
    "index": string;
    "create-coupon": string;
    "edit-coupon": string;
    "login": string;
    "logout": string;
  }

  const icons: Indexed = {
    "index": "fa-solid fa-list",
    "create-coupon": "fa-solid fa-plus",
    "edit-coupon": "fa-solid fa-pen-to-square",
    "login": "fa-solid fa-right-to-bracket",
    "logout": "fa-solid fa-right-from-bracket"
  }

  const titles: Indexed = {
    "index": "Listado de cupones",
    "create-coupon": "Crear cupon",
    "edit-coupon": "Modificar cupon",
    "login": "Iniciar sesion",
    "logout": "Cerrar sesion"
  }
</script>