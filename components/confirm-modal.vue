<template>
  <div class="fixed z-50 top-0 left-0 flex justify-center items-center bg-black bg-opacity-75 p-2 pl-16 w-full h-screen">
    <div class="flex flex-col md:w-6/12 px-8 py-4 bg-white rounded-lg">
      <p class="text-xl md:text-2xl mb-4 text-center font-semibold">¿Esta seguro de eliminar el cupon?</p>
      
      <div class="relative flex justify-center items-center gap-2">
        <button @click="$emit('toggleConfirm')" class="w-1/2 mt-1 py-2 rounded-lg text-white font-semibold bg-red-400 hover:bg-red-300 active:bg-red-500 transition duration-200" type="submit">Cancelar</button>

        <button @click="$emit('deleteCoupon', props.couponId)" class="w-1/2 mt-1 py-2 rounded-lg text-white font-semibold bg-blue-400 hover:bg-blue-300 active:bg-blue-500 transition duration-200" type="submit">Aceptar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps(['couponId']);
</script>