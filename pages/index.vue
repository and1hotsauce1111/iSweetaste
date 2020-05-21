<template>
  <div>
    <div class="banner__container">
      <img
        class="banner__img"
        src="~assets/img/banner/banner1.jpeg"
        alt=""
        width="940"
        height="496"
      />
      <div class="banner__news">
        <ul class="banner__news_list">
          <li v-for="(item, index) in newsBox" :key="index">
            <a href="#" class="banner__news_list_item">
              <div :class="['banner__news_box ' + item.class]"></div>
              <div :class="['banner_news_box_bg ' + item.class]"></div>
              <div :class="['banner_news_box_word ' + item.class]">
                {{ item.title }}
              </div>
            </a>
          </li>
        </ul>
      </div>
      <div class="story"></div>
      <div class="procut-list"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newsBox: [
        {
          title: '本日精選',
          class: 'today'
        },
        {
          title: '人氣推薦',
          class: 'top'
        },
        {
          title: '新品上市',
          class: 'new'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/home/_index.scss';
</style>
