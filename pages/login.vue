<template>
  <div class="relative z-0 p-2 pl-16 w-full h-screen overflow-auto">
    <p class="relative md:w-1/4 mx-auto md:mt-12 text-2xl font-semibold mb-4 p-2 md:p-4 rounded-lg border-2 border-blue-600">Iniciar sesion</p>

    <form method="POST" @submit.prevent="mySignInHandler" class="relative md:w-1/4 p-2 md:p-4 mx-auto mt-4 rounded-lg border-2 border-blue-600">
      <label class="cursor-pointer" for="email">
        <p>Correo electronico</p>
        <input class="block w-full my-2 p-2 rounded-lg border-2 border-blue-600 outline-none" placeholder="johndoe@email.com" type="email" v-model="email" id="email" required>
      </label>

      <label class="cursor-pointer" for="password">
        <p>Contraseña</p>
        <input class="block w-full my-2 p-2 rounded-lg border-2 border-blue-600 outline-none" placeholder="Johndoe2023" type="password" v-model="password" id="password" required>
      </label>

      <p @click="closeError" v-if="signError" class="w-full rounded-lg my-2 p-2 text-sm text-white font-semibold text-center bg-red-400 cursor-pointer">Correo o contraseña incorrectos.</p>
      
      <button class="w-full my-1 px-4 py-2 rounded-lg text-white font-semibold bg-green-400 md:hover:bg-green-300 md:active:bg-green-500 md:transition md:duration-200" type="submit">Entrar</button>
    </form>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({ auth: false });
  
  const { status, signIn } = useSession();
  const email = ref('');
  const password = ref('');
  const signError = ref(false);

  const closeError = () => {
    signError.value = !signError.value;
  }

  const mySignInHandler = async () => {
    const { error } = await signIn('credentials', {email: email.value, password: password.value, redirect: false});
    
    if (error !== null) signError.value = !signError.value;
  }

  watchEffect(() => {
    if (status.value === 'authenticated') return navigateTo('/');
  });
</script>