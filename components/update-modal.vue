<template>
  <div class="absolute top-0 left-0 bg-black bg-opacity-75 p-2 pl-16 w-full h-screen">
    <i @click="$emit('openModal')" class="fa-solid fa-xmark absolute md:text-xl cursor-pointer top-4 right-4 rounded-full w-6 h-6 md:w-10 md:h-10 flex justify-center items-center bg-white hover:bg-gray-400 hover:text-white transition duration-200"></i>

    <p v-if="state.isSuccess === 'success'" class="relative w-full text-white md:text-center md:text-3xl font-semibold mb-1 px-4 py-2 bg-green-500 rounded-lg overflow-hidden">{{ state.message }}<i @click="() => state.isSuccess = ''" class="fa-solid fa-xmark absolute md:text-xl cursor-pointer top-0 right-0 w-12 h-full flex hover:bg-green-400 justify-center items-center border-l-2"></i></p>

    <div class="mx-auto md:w-4/12 px-4 py-2 bg-blue-500 text-white text-xl md:text-3xl font-semibold rounded-lg">Actualizar cupon</div>

    <div class="mx-auto md:w-4/12 p-2 my-1 bg-blue-500 rounded-lg">
      <form @submit.prevent="updateCoupon" class="relative flex flex-col gap-2 text-white bg-blue-500 rounded-lg">
        <label class="text-sm md:text-xl font-bold flex justify-between items-center" for="coupon-store">
          Tienda:
          <input class="w-2/3 md:w-auto text-black text-base font-normal p-2 rounded-lg outline-none" v-model="coupon_store" id="coupon-store" type="text" placeholder="ej: Amazon">
        </label>
        <span v-if="errors.coupon_store" class="bg-red-400 p-1 rounded text-sm md:text-base">{{ errors.coupon_store }}</span>

        <label class="text-sm md:text-xl font-bold flex justify-between items-center" for="coupon-code">
          Codigo:
          <input class="w-2/3 md:w-auto text-black text-base font-normal p-2 rounded-lg outline-none" v-model="coupon_code" id="coupon-code" type="text" placeholder="ej: CODIGO1234">
        </label>
        <span v-if="errors.coupon_code" class="bg-red-400 p-1 rounded text-sm md:text-base">{{ errors.coupon_code }}</span>

        <label class="text-sm md:text-xl font-bold flex justify-between items-center" for="coupon-quantity">
          Cantidad:
          <input class="w-2/3 md:w-auto text-black text-base font-normal p-2 rounded-lg outline-none" v-model="coupon_quantity" id="coupon-quantity" type="number" placeholder="ej: 50">
        </label>
        <span v-if="errors.coupon_quantity" class="bg-red-400 p-1 rounded text-sm md:text-base">{{ errors.coupon_quantity }}</span>

        <label class="text-sm md:text-xl font-bold flex justify-between items-center" for="coupon-discount">
          Descuento:
          <input class="w-2/3 md:w-auto text-black text-base font-normal p-2 rounded-lg outline-none" v-model="coupon_discount" id="coupon-discount" type="number" placeholder="ej: 5.45" step="0.01">
        </label>
        <span v-if="errors.coupon_discount" class="bg-red-400 p-1 rounded text-sm md:text-base">{{ errors.coupon_discount }}</span>

        <label class="text-sm md:text-xl font-bold flex justify-between items-center" for="coupon-logo">
          Imagen:
          <input class="w-2/3 md:w-auto text-black text-base font-normal p-2 rounded-lg outline-none" v-model="coupon_logo" id="coupon-logo" type="url" placeholder="ej: https://www.imageurl.png">
        </label>
        <span v-if="errors.coupon_logo" class="bg-red-400 p-1 rounded text-sm md:text-base">{{ errors.coupon_logo }}</span>

        <button class="w-full md:text-xl mt-1 px-4 py-2 rounded-lg text-white font-semibold bg-green-400 hover:bg-green-300 active:bg-green-500 transition duration-200" type="submit">Crear cupon</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useField, useForm } from "vee-validate";
  import { toFormValidator } from "@vee-validate/zod";
  import * as zod from "zod";

  const props = defineProps(['couponData'])
  const state = reactive({ message: '', isSuccess: '', error: '' });

  const validationSchema = toFormValidator(
    zod.object({
      coupon_store: zod.string({
        required_error: "Tienda es requerido.",
      }),
      coupon_code: zod.string({
        required_error: "Codigo es requerido."
      }),
      coupon_quantity: zod.number({
        required_error: "Cantidad es requerido.",
        invalid_type_error: "Se espera un numero, se recibio un texto."
      }).int({
        message: "El valor no es un entero."
      }).positive({
        message: "El valor no es positivo."
      }),
      coupon_discount: zod.number({
        required_error: "Descuento es requerido.",
        invalid_type_error: "Se espera un numero, se recibio un texto."
      }).positive({
        message: "El valor no es positivo."
      }),
      coupon_logo: zod.string({
        required_error: "Imagen es requerido."
      }).url({
        message: "URL invalido."
      })
    })
  );

  const { handleSubmit, errors } = useForm({ validationSchema });
  const id = props.couponData[0]?._id;
  let { value: coupon_store } = useField("coupon_store");
  let { value: coupon_code } = useField("coupon_code");
  let { value: coupon_quantity } = useField("coupon_quantity");
  let { value: coupon_discount } = useField("coupon_discount");
  let { value: coupon_logo } = useField("coupon_logo");

  coupon_store.value = props.couponData[0]?.store;
  coupon_code.value = props.couponData[0]?.coupon_code;
  coupon_quantity.value = props.couponData[0]?.quantity;
  coupon_discount.value = props.couponData[0]?.coupon_discount;
  coupon_logo.value = props.couponData[0]?.store_image;
  
  const updateCoupon = handleSubmit(async () => {
    const { data: status, error } = await useFetch("/coupon/update",
      {
        params: { 
          _id: id,
          store: coupon_store,
          coupon_code,
          quantity: coupon_quantity,
          coupon_discount,
          store_image: coupon_logo,
          remaining: props.couponData[0]?.remaining
         },
        method: 'POST'
      }
    );

    if (status.value !== null) {
      state.message = status.value.message;
      state.isSuccess = status.value.isSuccess;
    }

    if (error.value !== null) {
      state.error = `${error.value.response?.statusText}`;
    }
  });
</script>