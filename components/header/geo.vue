<template>
  <div class="header__currentCity">
    <fa :icon="['fas', 'map-marker-alt']" />
    &nbsp;{{ currentCity }}
  </div>
</template>

<script>
export default {
  computed: {
    currentCity() {
      return this.$store.state.geo.position.city
    }
  }
}
</script>

<style lang="scss" scoped>
.header__currentCity {
  flex: 0 0 15%;
  margin-right: 5px;
  line-height: 100px;
  text-align: center;
  max-width: 112px;
}

// 平板轉橫
@media screen and (max-width: 1023px) {
  .header__currentCity {
    flex: 0 0 16%;
    margin-left: 1rem;
    line-height: 80px;
  }
}
// pad
@media screen and (max-width: 767px) {
  .header__currentCity {
    margin-left: 0.5rem;
  }
}
// mobile
@media screen and (max-width: 414px) {
  .header__currentCity {
    display: none;
  }
}
</style>
