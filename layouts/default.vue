<template>
  <div class="layout-container">
    <Header />
    <nuxt />
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/header/index'
import Footer from '@/components/footer/index'

export default {
  components: {
    Header,
    Footer
  }
}
</script>

<style lang="scss" scoped></style>
