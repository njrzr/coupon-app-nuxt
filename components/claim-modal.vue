<template>
  <div class="fixed top-0 left-0 bg-black bg-opacity-75 p-2 pl-16 w-full h-screen">
    <i @click="$emit('openModal')" class="fa-solid fa-xmark absolute md:text-xl cursor-pointer top-4 right-4 rounded-full w-6 h-6 md:w-10 md:h-10 flex justify-center items-center bg-white md:hover:bg-gray-400 md:hover:text-white md:transition md:duration-200"></i>

    <p v-if="isSuccess === 'success'" class="relative w-full text-white md:text-center md:text-3xl font-semibold mb-1 px-4 py-2 bg-green-500 rounded-lg overflow-hidden">
      {{ successMessage }}
      <i @click="() => isSuccess = ''" class="fa-solid fa-xmark absolute md:text-xl cursor-pointer top-0 right-0 w-12 h-full flex md:hover:bg-green-400 justify-center items-center border-l-2"></i>
    </p>
    
    <p v-if="isError !== ''" class="relative w-full text-white md:text-center md:text-3xl font-semibold mb-1 px-4 py-2 bg-red-500 rounded-lg overflow-hidden">
      {{ isError }}
      <i @click="() => isError = ''" class="fa-solid fa-xmark absolute md:text-xl cursor-pointer top-0 right-0 w-12 h-full flex md:hover:bg-red-400 justify-center items-center border-l-2"></i>
    </p>

    <div class="mx-auto md:w-4/12 px-4 py-2 bg-blue-500 text-white text-xl md:text-3xl font-semibold rounded-lg">Canjear cupon</div>

    <div class="mx-auto md:w-4/12 p-2 my-1 bg-blue-500 rounded-lg">
      <form @submit.prevent class="relative flex flex-col gap-2 text-white bg-blue-500 rounded-lg">
        <label class="text-sm md:text-xl font-bold flex justify-between items-center" for="coupon-store">
          Nombre:
          <input class="w-2/3 md:w-auto text-black text-base font-normal p-2 rounded-lg outline-none" id="coupon-store" type="text" placeholder="ej: John Doe" v-model="username">
        </label>
        <span v-if="errors.username" class="bg-red-400 p-1 rounded text-sm md:text-base">{{ errors.username }}</span>

        <label class="text-sm md:text-xl font-bold flex justify-between items-center" for="coupon-code">
          Correo:
          <input class="w-2/3 md:w-auto text-black text-base font-normal p-2 rounded-lg outline-none" id="coupon-code" type="email" placeholder="ej: johndoe@email.com" v-model="email">
        </label>
        <span v-if="errors.email" class="bg-red-400 p-1 rounded text-sm md:text-base">{{ errors.email }}</span>

        <label class="text-sm md:text-xl font-bold flex justify-between items-center" for="coupon-quantity">
          Telefono:
          <input class="w-2/3 md:w-auto text-black text-base font-normal p-2 rounded-lg outline-none" id="coupon-quantity" type="tel" placeholder="ej: 551111234567" v-model="telephone">
        </label>
        <span v-if="errors.telephone" class="bg-red-400 p-1 rounded text-sm md:text-base">{{ errors.telephone }}</span>

        <button @click.prevent="claimCoupon" :class="['w-full', 'md:text-xl', 'mt-1', 'px-4', 'py-2', 'rounded-lg', 'text-white', 'font-semibold', 'md:transition', 'md:duration-200', isClaimed ? 'bg-gray-400' : 'bg-green-400 md:hover:bg-green-300 md:active:bg-green-500']" type="submit" :disabled="isClaimed">
          {{ isClaimed ? 'Deshabilitado' : 'Canjear cupon' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useField, useForm } from "vee-validate";
  import { toFormValidator } from "@vee-validate/zod";
  import * as zod from "zod";

  const emit = defineEmits(['openModal']);
  const props = defineProps(['couponId']);
  const successMessage = ref('');
  const isSuccess = ref('');
  const isError = ref('');
  const isClaimed = ref(false);

  const validationSchema = toFormValidator(
    zod.object({
      username: zod.string({
        required_error: "Nombre es requerido."
      }),
      email: zod.string({
        required_error: "Correo es requerido."
      }).email({
        message: "Correo invalido."
      }),
      telephone: zod.string({
        required_error: "Telefono es requerido."
      }).min(9, {
        message: "Debe ser mas de 9 digitos."
      })
    })
  );

  const { handleSubmit, errors } = useForm({ validationSchema });
  const id = props.couponId;
  let { value: username } = useField("username");
  let { value: email } = useField("email");
  let { value: telephone } = useField("telephone");

  const claimCoupon = (handleSubmit(async () => {
    if (isClaimed.value === true) {
      const consoleStyle = `
        background: red;
        font-size: 2rem;
        color: #ffffff;
        padding: 0.5rem;
        border-radius: 0.25rem;
      `

      return console.log('%cAccion prohibida, no puedes canjear otro cupon.', consoleStyle);
    }

    await $fetch("/coupon/claim", {
      method: 'POST',
      body: { id: id, user: username.value, email: email.value, tel: telephone.value }
    }).then(response => {
      successMessage.value = response.message;
      isSuccess.value = response.isSuccess;
      isClaimed.value = !isClaimed.value;
    }).catch(err => {
      isError.value = "Error interno del servidor.";
    });
  }));
</script>