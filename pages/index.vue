<template>
  <div class="relative z-0 p-2 pl-16 pb-10 w-full h-screen overflow-auto">
    <p class="relative w-full text-white text-xl md:text-3xl font-semibold mb-1 px-4 py-2 bg-blue-500 rounded-lg">Cupones disponibles</p>
    
    <div class="relative grid grid-cols-1 md:grid-cols-4 gap-1">
      <div class="relative flex flex-col justify-around text-white bg-blue-500 rounded-lg p-1 overflow-hidden" v-for="coupon in coupons" key="coupon-{{ coupon._id }}" v-show="couponsAvailable(coupon._id) >= 1" :coupon="coupon">
        <div class="flex flex-row gap-1">
          <picture class="flex justify-center items-center w-24 h-24 bg-white rounded-lg overflow-hidden">
            <img class="w-full p-4 bg-cover" :src="coupon.store_image" alt="Store Logo" />
          </picture>
          
          <div class="w-4/6">
            <p>{{ coupon.store }}</p>
            <p>Descuento: ${{ coupon.coupon_discount }}</p>
            <p>Disponibles: {{ couponsAvailable(coupon._id) }}</p>
          </div>
        </div>

        <button @click="openModal(coupon._id)" :class="['font-semibold', 'md:transition', 'md:duration-200', 'rounded-lg', 'mt-1', 'py-1', couponsAvailable(coupon._id) < 1 ? 'bg-gray-400' : 'bg-green-400 md:hover:bg-green-300']" :disabled="couponsAvailable(coupon._id) < 1">
          {{ couponsAvailable(coupon._id) < 1 ? 'Agotado' : 'Canjear' }}
        </button>
      </div>
    </div>
  </div>

  <ClaimModal v-if="isOpen" @openModal="openModal" :couponId="couponId" />
</template>

<script setup lang="ts">
  const { data: coupons, refresh } = await useFetch("/coupon/list");
  const isOpen = ref(false);
  const couponId = ref('');

  const couponsAvailable = (id: string) =>{
    const coupon = coupons.value.find((e: any) => e._id == id);
    return coupon.quantity - coupon.claimed;
  }

  const openModal = (data: string = '') => {
    if (data !== '') {
      if (couponsAvailable(data) < 1) {
        const consoleStyle = `
          background: red;
          font-size: 2rem;
          color: #ffffff;
          padding: 0.5rem;
          border-radius: 0.25rem;
        `

        return console.log('%cAccion prohibida, cupones agotados.', consoleStyle);
      }
    }

    if (couponId.value != '') {
      couponId.value = '';
    } else {
      couponId.value = data;
    }

    isOpen.value = !isOpen.value;
    refresh();
  };
</script>