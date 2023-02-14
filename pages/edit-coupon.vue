<template>
  <div class="relative z-0 p-2 pl-16 w-full h-screen">
    <p class="relative w-full text-white text-xl md:text-3xl font-semibold mb-1 px-4 py-2 bg-blue-500 rounded-lg">Editar cupon</p>

    <p v-if="state.isSuccess === 'success'" class="relative w-full text-white md:text-center md:text-3xl font-semibold mb-1 px-4 py-2 bg-green-500 rounded-lg overflow-hidden">{{ state.message }}<i @click="() => state.isSuccess = ''" class="fa-solid fa-xmark absolute md:text-xl cursor-pointer top-0 right-0 w-12 h-full flex hover:bg-green-400 justify-center items-center border-l-2"></i></p>
    
    <div class="relative grid grid-cols-1 md:grid-cols-4 gap-1">
      <div v-for="coupon, index in state.coupons" class="relative bg-blue-500 text-white p-1 rounded-lg" :key="'coupon-' + index">
        <div class="flex flex-row gap-1">
          <picture class="bg-white w-24 h-24 flex justify-center items-center rounded-lg overflow-hidden">
            <img class="w-full p-4 bg-cover" :src="coupon.store_image" alt="Store Logo.">
          </picture>
          
          <div class="flex w-4/6 flex-col">
            <p>{{ coupon.store }}</p>
            <p>Disponibles: {{ coupon.quantity - coupon.claimed }}</p>
            <p>Total: {{ coupon.quantity }}</p>
          </div>
        </div>
        
        <div class="flex gap-1 mt-1">
          <button @click.prevent="openModal(coupon)" class="w-1/2 p-1 rounded-lg text-white font-semibold bg-green-400 hover:bg-green-300 active:bg-green-500 transition duration-200" type="submit">Modificar</button>

          <button @click.prevent="deleteCoupon(coupon._id)" class="w-1/2 p-1 rounded-lg text-white font-semibold bg-red-400 hover:bg-red-300 active:bg-red-500 transition duration-200" type="submit">Eliminar</button>
        </div>
      </div>
    </div>

    <UpdateModal v-if="state.isOpen" @openModal="openModal" :couponData="couponData" />
  </div>
</template>

<script setup lang="ts">
  definePageMeta({ middleware: 'auth' });
  let couponData: string[] = []

  const { data: coupons } = await useFetch("/coupon/list");
  const state = reactive({ isOpen: false, coupons, message: '', isSuccess: '', error: '' });

  const openModal = (data: any = []) => {
    if (couponData.length != 0) {
      couponData = [];
    } else {
      couponData.push(data);
    }

    state.isOpen = !state.isOpen;
  };

  const deleteCoupon = async (id: string) => {
    const { data: status, error } = await useFetch("/coupon/delete",
    {
      params: { id },
      method: 'POST'
    });

    state.message = status.value.message;
    state.isSuccess = status.value.isSuccess;
  }
</script>