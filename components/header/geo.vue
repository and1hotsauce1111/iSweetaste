<template>
  <div class="header__currentCity">
    <fa :icon="['fas', 'map-marker-alt']" />&nbsp; 當前城市 | Taichung
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.header__currentCity {
  flex: 0 0 20%;
  margin-right: 5px;
  line-height: 100px;
}
</style>
