<template>
  <div class="relative z-0 p-2 pl-16 w-full h-screen overflow-auto">
    <p class="relative md:w-4/12 text-white text-xl md:text-3xl font-semibold mx-auto mb-1 px-4 py-2 bg-blue-500 rounded-lg">Crear cupon</p>
    
    <p v-if="isSuccess === 'success'" class="relative md:w-4/12 mx-auto text-white md:text-center md:text-3xl font-semibold mb-1 px-4 py-2 bg-green-500 rounded-lg overflow-hidden">
      {{ successMessage }}
      <i @click="() => isSuccess = ''" class="fa-solid fa-xmark absolute md:text-xl cursor-pointer top-0 right-0 w-12 h-full flex md:hover:bg-green-400 justify-center items-center border-l-2"></i>
    </p>
    
    <p v-if="isError !== ''" class="relative md:w-4/12 mx-auto text-white md:text-center md:text-3xl font-semibold mb-1 px-4 py-2 bg-red-500 rounded-lg overflow-hidden">
      {{ isError }}
      <i @click="() => isError = ''" class="fa-solid fa-xmark absolute md:text-xl cursor-pointer top-0 right-0 w-12 h-full flex md:hover:bg-red-400 justify-center items-center border-l-2"></i>
    </p>
    
    <form @keydown.stop @keyup.stop class="relative flex flex-col gap-2 text-white bg-blue-500 rounded-lg md:mx-auto p-2 md:w-4/12">
      <label class="text-sm md:text-xl font-bold flex justify-between items-center" for="coupon-store">
        Tienda:
        <input class="w-2/3 md:w-auto text-black text-base font-normal p-2 rounded-lg outline-none" v-model="coupon_store" id="coupon-store" type="text" placeholder="ej: Amazon">
      </label>
      <span v-if="errors.coupon_store" class="text-sm  md:text-base bg-red-400 p-1 rounded">{{ errors.coupon_store }}</span>

      <label class="text-sm md:text-xl font-bold flex justify-between items-center" for="coupon-code">
        Codigo:
        <input class="w-2/3 md:w-auto text-black text-base font-normal p-2 rounded-lg outline-none" v-model="coupon_code" id="coupon-code" type="text" placeholder="ej: CODIGO1234">
      </label>
      <span v-if="errors.coupon_code" class="text-sm  md:text-base bg-red-400 p-1 rounded">{{ errors.coupon_code }}</span>

      <label class="text-sm md:text-xl font-bold flex justify-between items-center" for="coupon-quantity">
        Cantidad:
        <input class="w-2/3 md:w-auto text-black text-base font-normal p-2 rounded-lg outline-none" v-model="coupon_quantity" id="coupon-quantity" type="number" placeholder="ej: 50">
      </label>
      <span v-if="errors.coupon_quantity" class="text-sm  md:text-base bg-red-400 p-1 rounded">{{ errors.coupon_quantity }}</span>

      <label class="text-sm md:text-xl font-bold flex justify-between items-center" for="coupon-discount">
        Descuento:
        <input class="w-2/3 md:w-auto text-black text-base font-normal p-2 rounded-lg outline-none" v-model="coupon_discount" id="coupon-discount" type="number" placeholder="ej: 5.45" step="0.01">
      </label>
      <span v-if="errors.coupon_discount" class="text-sm  md:text-base bg-red-400 p-1 rounded">{{ errors.coupon_discount }}</span>

      <label class="text-sm md:text-xl font-bold flex justify-between items-center" for="coupon-logo">
        Imagen:
        <input class="w-2/3 md:w-auto text-black text-base font-normal p-2 rounded-lg outline-none" v-model="coupon_logo" id="coupon-logo" type="url" placeholder="ej: https://www.imageurl.png">
      </label>
      <span v-if="errors.coupon_logo" class="text-sm  md:text-base bg-red-400 p-1 rounded">{{ errors.coupon_logo }}</span>

      <button @click.prevent="createCoupon" class="w-full md:text-xl mt-1 px-4 py-2 rounded-lg text-white font-semibold bg-green-400 md:hover:bg-green-300 md:active:bg-green-500 md:transition md:duration-200" type="button">Crear cupon</button>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { useField, useForm } from "vee-validate";
  import { toFormValidator } from "@vee-validate/zod";
  import * as zod from "zod";

  definePageMeta({ middleware: 'auth' });

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
  const { value: coupon_store } = useField("coupon_store");
  const { value: coupon_code } = useField("coupon_code");
  const { value: coupon_quantity } = useField("coupon_quantity");
  const { value: coupon_discount } = useField("coupon_discount");
  const { value: coupon_logo } = useField("coupon_logo");

  const successMessage = ref('');
  const isSuccess = ref('');
  const isError = ref('');

  const createCoupon = handleSubmit(async () => {
    await $fetch("/coupon/create", {
        method: 'POST',
        body: {
          store: coupon_store.value,
          code: coupon_code.value,
          quantity: coupon_quantity.value,
          discount: coupon_discount.value,
          logo: coupon_logo.value 
        }
    }).then(response => {
      successMessage.value = response.message;
      isSuccess.value = response.isSuccess;
    }).catch(err => {
      isError.value = 'Error interno del servidor.';
    });
  });
</script>