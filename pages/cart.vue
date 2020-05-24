<template>
  <div class="cart__section">
    <div class="cart__section_wrap">
      <div class="cart__section_shoppingList">
        <div class="cart__section_shoppingList_title">
          <h1>您的購物車</h1>
          <ul class="cart__section_shoppingList_list">
            <li
              v-for="(list, index) in shoppingList"
              :key="index"
              class="cart__section_shoppingList_item"
            >
              <div class="cart__section_shoppingList_item_img" :style="list.styleObject"></div>
              <div class="cart__section_shoppingList_item_name">
                <h3>{{ list.name }}</h3>
                <span>NT$ {{ list.price }}</span>
              </div>
              <div class="cart__section_shoppingList_item_editCount">
                <div class="cart__section_shoppingList_item_add">
                  <fa :icon="['fas', 'minus']" />
                </div>
                <div class="cart__section_shoppingList_item_num">1</div>
                <div class="cart__section_shoppingList_item_minus">
                  <fa :icon="['fas', 'plus']" />
                </div>
              </div>
              <div class="cart__section_shoppingList_item_price">NT$ {{ 'NT$' + list.price }}</div>
              <div class="cart__section_shoppingList_item_delete">
                <fa :icon="['fas', 'trash']" />
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="cart__section_order">
        <div class="cart__section_order_list">
          <div class="cart__section_order_list_title">
            <h3>訂單摘要</h3>
          </div>
          <div class="cart__section_order_list_sum">
            <span>小計</span>
            <span>NT$ 2,700</span>
          </div>
          <div class="cart__section_order_list_fee">
            <span>運費</span>
            <span>NT$ 300</span>
          </div>
          <div class="cart__section_order_list_total">
            <span>總計</span>
            <span>NT$ 3,000</span>
          </div>
        </div>
        <a class="cart__section_order_submit" href="#">結帳</a>
      </div>
    </div>
    <!-- mobile -->
    <div class="mobile__area">
      <div class="mobile__cart__section_wrap">
        <div class="mobile__cart__section_shoppingList">
          <div class="mobile__cart__section_shoppingList_title">
            <h3>您的購物車</h3>
          </div>
          <ul class="mobile__cart__section_shoppingList_list">
            <li
              v-for="(list, index) in shoppingList"
              :key="index"
              class="mobile__cart__section_shoppingList_item"
            >
              <div class="mobile__cart__section_shoppingList_item_info">
                <div class="mobile__cart__section_shoppingList_item_img" :style="list.styleObject"></div>
                <div class="mobile__cart__section_shoppingList_item_product">
                  <div class="mobile_cart__section_shoppingList_item_name">
                    <h3>{{ list.name }}</h3>
                    <span>NT$ {{ list.price }}</span>
                  </div>
                  <div class="mobile_cart__section_shoppingList_item_editCount">
                    <div class="mobile__cart__section_shoppingList_item_add">
                      <fa :icon="['fas', 'minus']" />
                    </div>
                    <div class="mobile__cart__section_shoppingList_item_num">1</div>
                    <div class="mobile__cart__section_shoppingList_item_minus">
                      <fa :icon="['fas', 'plus']" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="mobile__cart__section_shoppingList_item_price">NT$ {{ list.price }}</div>
            </li>
          </ul>
        </div>
        <div class="mobile__cart__section_order">
          <div class="mobile__cart__section_order_title">
            <h3>訂單摘要</h3>
          </div>
          <div class="mobile__cart__section_order_list_sum">
            <span>小計</span>
            <span>NT$ 2,700</span>
          </div>
          <div class="mobile__cart__section_order_list_fee">
            <span>運費</span>
            <span>NT$ 300</span>
          </div>
          <div class="mobile__cart__section_order_list_total">
            <span>總計</span>
            <span>NT$ 3,000</span>
          </div>
        </div>
      </div>
      <a class="mobile__cart__section_order_submit" href="#">結帳</a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shoppingList: [
        {
          styleObject: {
            background: `url(${require('@/assets/img/product/product7.jpeg')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          },
          name: '草莓塔',
          price: 450
        },
        {
          styleObject: {
            background: `url(${require('@/assets/img/product/product9.jpeg')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          },
          name: '蜜桃冰棒',
          price: 650
        },
        {
          styleObject: {
            background: `url(${require('@/assets/img/product/product8.jpeg')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
          },
          name: '薔薇派',
          price: 880
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/cart/_cart.scss';
</style>