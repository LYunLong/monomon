<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'

import ez_3d_show from '../../../views/ez_3d_show.vue'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>
  <ez_3d_show class="ezs" ></ez_3d_show>
  <main>
    <TheWelcome />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  position: relative;
  /* z-index: 1; */
}
header img {
  z-index: -1;
}
main {
  position: relative;
  z-index: -1;
}
.logo {
  display: block;
  margin: 0 auto 2rem;
}

.ezs {
  margin-top: -10rem;
  margin-bottom: -30rem;
  position: relative;
  z-index: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }
  .ezs {
    margin-top: 0;
    margin-bottom: -30rem;
    margin-left: -10rem;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
