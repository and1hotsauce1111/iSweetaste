<template>
  <div class="header__currentCity">
    <fa :icon="['fas', 'map-marker-alt']" />&nbsp;Taichung
  </div>
</template>

<script>
export default {}
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
    flex: 0 0 15%;
    margin-left: 1rem;
    line-height: 80px;
  }
}
// pad
@media screen and (max-width: 768px) {
  .header__currentCity {
    display: none;
  }
}
// mobile
@media screen and (max-width: 376px) {
  .header__currentCity {
    display: none;
  }
}
</style>
