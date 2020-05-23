<template>
  <div>
    <div class="banner__container">
      <div class="banner__img"></div>
    </div>
    <!-- product -->
    <div class="product__section">
      <div class="product__container">
        <div class="product__menu">
          <div class="product__menu_title">
            甜點類別
          </div>
          <div class="product__menu_list_container">
            <ul class="product__menu_list_ul">
              <li
                v-for="(list, index) in menuList"
                :key="index"
                class="product__menu_list_li"
              >
                {{ list.title }}<span>&nbsp;&nbsp;({{ list.num }})</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="product-list">
          <div class="product-list__container">
            <div
              v-for="(item, index) in productItem"
              :key="index"
              class="product-list-item__container"
            >
              <!-- <img class="product-list-item_img" :src="item.img" alt /> -->
              <div
                class="product-list-item_img"
                :style="item.styleObject"
              ></div>
              <div class="product-list-item_info">
                <div class="info_name">
                  {{ item.name }}
                </div>
                <div class="info_price">
                  {{ 'NT$ ' + item.price }}
                </div>
              </div>
              <div class="product-list-item_addCart">
                <button class="addCart_btn">
                  加入購物車
                </button>
              </div>
              <span class="product-list-item_today">本日精選</span>
              <span class="product-list-item_like">
                <fa :icon="['far', 'heart']" />
              </span>
            </div>
          </div>
          <div class="product-list__pagination">
            <div class="product-list__pagination_page">
              <span class="pre">
                <fa :icon="['fas', 'caret-left']" />
              </span>
              <span class="page">1</span>
              <span class="page">2</span>
              <span class="page">3</span>
              <span class="next">
                <fa :icon="['fas', 'caret-right']" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuList: [
        {
          title: '所有甜點',
          num: 48
        },
        {
          title: '本日精選',
          num: 10
        },
        {
          title: '人氣推薦',
          num: 26
        },
        {
          title: '新品上市',
          num: 12
        }
      ],
      productItem: [
        {
          name: '焦糖馬卡龍',
          price: 450,
          styleObject: {
            background: `url(${require('@/assets/img/product/product1.jpeg')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          },
          imgClass: 'img1'
        },
        {
          name: '草莓森林',
          price: 550,
          styleObject: {
            background: `url(${require('@/assets/img/product/product2.jpeg')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          },
          imgClass: 'img2'
        },
        {
          name: '藍莓優格',
          price: 650,
          styleObject: {
            background: `url(${require('@/assets/img/product/product3.jpeg')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          },
          imgClass: 'img3'
        },
        {
          name: '奇異果冰沙',
          price: 750,
          styleObject: {
            background: `url(${require('@/assets/img/product/product4.jpeg')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          },
          imgClass: 'img3'
        },
        {
          name: '法式吐司',
          price: 680,
          styleObject: {
            background: `url(${require('@/assets/img/product/product5.jpeg')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          },
          imgClass: 'img3'
        },
        {
          name: '香煎鬆餅',
          price: 980,
          styleObject: {
            background: `url(${require('@/assets/img/product/product6.jpeg')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          },
          imgClass: 'img3'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/public/_product.scss';
@import '@/assets/scss/product/_product.scss';
</style>
