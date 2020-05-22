<template>
  <div>
    <!-- banner -->
    <div class="banner__container">
      <img class="banner__img" src="~assets/img/banner/banner1.jpeg" alt />
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
    </div>
    <!-- story section -->
    <div class="story__section">
      <!-- story feature1 -->
      <div class="story_wrapper">
        <div class="story_container">
          <div class="story_col">
            <div class="story_img">
              <div class="story_bg_img story1"></div>
            </div>
            <div class="story_content">
              <div class="story_content_p">
                <p>
                  青山依舊在，幾度夕陽紅。慣看秋月春風。一壺濁酒喜相逢，浪花淘盡英雄。是非成敗轉頭空，滾滾長江東逝水，白髮漁樵江渚上，古今多少事，都付笑談中。
                </p>
                <p>
                  是非成敗轉頭空，滾滾長江東逝水，白髮漁樵江渚上，古今多少事，都付笑談中。
                </p>
              </div>
            </div>
            <div class="story_title">
              <img
                src="~assets/img/quote/desktop/lg-為什麼選擇了做甜點.svg"
                style="width: 89px; height: 307px;"
                alt="story_title"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- story feature2 -->
      <div class="story_wrapper">
        <div class="story_container">
          <div class="story_col">
            <div class="story_content">
              <div class="story_content_p">
                <p>
                  青山依舊在，幾度夕陽紅。慣看秋月春風。一壺濁酒喜相逢，浪花淘盡英雄。是非成敗轉頭空，滾滾長江東逝水，白髮漁樵江渚上，古今多少事，都付笑談中。
                </p>
                <p>
                  是非成敗轉頭空，滾滾長江東逝水，白髮漁樵江渚上，古今多少事，都付笑談中。
                </p>
              </div>
            </div>
            <div class="story_title">
              <img
                src="~assets/img/quote/desktop/lg-為什麼選擇了做甜點.svg"
                style="width: 89px; height: 307px;"
                alt="story_title"
              />
            </div>
            <div class="story_img">
              <div class="story_bg_img story2"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- slogan -->
      <div class="story__slogan">
        <img
          src="~assets/img/quote/desktop/lg-想吃甜點是不需要理由的.svg"
          alt
        />
      </div>
    </div>

    <!-- product list -->
    <div class="procut-list">
      <div class="procut-list__container">
        <div
          v-for="(item, index) in productItem"
          :key="index"
          class="product-list-item__container"
        >
          <img class="product-list-item_img" :src="item.img" alt />
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
    </div>

    <!-- mobile/pad section -->
    <div class="mobile__story_section">
      <div class="mobile__story_slogan slogan1"></div>
      <div class="mobile__story">
        <div class="mobile__story_col">
          <div class="mobile__story_img img1"></div>
          <div class="mobile__story_content">
            <p>
              青山依舊在，幾度夕陽紅。慣看秋月春風。一壺濁酒喜相逢，浪花淘盡英雄。是非成敗轉頭空，滾滾長江東逝水，白髮漁樵江渚上，古今多少事，都付笑談中。
            </p>
            <p>
              是非成敗轉頭空，滾滾長江東逝水，白髮漁樵江渚上，古今多少事，都付笑談中。
            </p>
          </div>
        </div>
      </div>
      <div class="mobile__story_slogan slogan2"></div>
      <div class="mobile__story">
        <div class="mobile__story_col">
          <div class="mobile__story_img img2"></div>
          <div class="mobile__story_content">
            <p>
              青山依舊在，幾度夕陽紅。慣看秋月春風。一壺濁酒喜相逢，浪花淘盡英雄。是非成敗轉頭空，滾滾長江東逝水，白髮漁樵江渚上，古今多少事，都付笑談中。
            </p>
            <p>
              是非成敗轉頭空，滾滾長江東逝水，白髮漁樵江渚上，古今多少事，都付笑談中。
            </p>
          </div>
        </div>
      </div>
      <div class="mobile__story_slogan slogan3"></div>
    </div>
    <!-- mobile/pad product list -->
    <div class="mobile__productList_section">
      <div
        v-for="(item, index) in productItem"
        :key="index"
        class="mobile__productList_container"
      >
        <div :class="['mobile__productList_img ' + item.imgClass]"></div>
        <div class="mobile__productList_info">
          <div class="mobile__productList_name">
            {{ item.name }}
          </div>
          <div class="mobile__productList_prize">
            {{ 'NT$ ' + item.price }}
          </div>
        </div>
        <button class="mobile__productList_addCart">
          加入購物車
        </button>
        <span class="mobile__productList_today">本日精選</span>
        <span class="mobile__productList_like">
          <fa :icon="['far', 'heart']" />
        </span>
      </div>
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
      ],
      productItem: [
        {
          name: '焦糖馬卡龍',
          price: 450,
          img: require('@/assets/img/product/product1.jpeg'),
          imgClass: 'img1'
        },
        {
          name: '草莓森林',
          price: 550,
          img: require('@/assets/img/product/product2.jpeg'),
          imgClass: 'img2'
        },
        {
          name: '藍莓優格',
          price: 650,
          img: require('@/assets/img/product/product3.jpeg'),
          imgClass: 'img3'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/home/_index.scss';
</style>
