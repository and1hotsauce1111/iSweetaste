<template>
  <div class="map__container">
    <div class="map__list_container">
      <div class="map__list_selectCity">
        <div class="map__list_city">
          <span class="map__list_city_title">請選擇城市:</span>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="map__list_area">
          <span class="map__list_area_title">請選擇區域: </span>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="map__list_searchResult">
        <span class="map__list_searchResult_result">搜尋結果：共 15 家店家</span>
      </div>
      <div class="map__list_showShop">
        <div class="map__list_showShop_list">
          <h3 class="map__list_showShop_list_title">柳原教會</h3>
          <div class="map__list_showShop_list_address">
            地址:&nbsp;
            <a href="#" class="map__list_showShop_list_address_link">
              臺中市400中區興中街119號
            </a>
          </div>
          <div class="map__list_showShop_list_phone">
            電話:&nbsp;
            <a href="javascript:;" class="map__list_showShop_list_phone_link">
              886-4-22222749
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="map__shopMap_container"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      value: ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/shop/_shop.scss';
</style>
