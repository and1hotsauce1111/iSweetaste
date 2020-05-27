<template>
  <div class="map__container">
    <div class="map__list_container">
      <div class="map__list_selectCity">
        <div class="map__list_city">
          <span class="map__list_city_title">請選擇城市:</span>
          <el-select v-model="value" placeholder="请选择" size="meduim">
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
      <!-- 手機選單 -->
      <div class="mobile__map__list_selectCity">
        <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
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
    <div class="map__shopMap_container">
      <div id="map"></div>
    </div>
  </div>
</template>

<script>
// 解決組件初始化抓不到windows物件
let $L
if (process.client) {
  $L = require('leaflet')
}

// OSM Map init
let osmMap = {}
// OSM config methods
// const osmConfig = {
//   addMapMarker(x, y, shop) {
//     $L.marker([y, x]).addTo(osmMap).bindPopup(`<strong>${shop.Name}</strong><br>
//       地址: <a href="https://www.google.com.tw/maps/place/${shop.Add}" target="_blank">${shop.Add}</a><br>
//       電話: ${shop.Tel}<br>`)
//   },
//   removeMapMarker() {
//     osmMap.eachLayer(layer => {
//       if (layer instanceof $L.Marker) {
//         osmMap.removeLayer(layer)
//       }
//     })
//   },
//   panTo(x, y, shop) {
//     osmMap.panTo(new $L.LatLng(y, x))
//     this.addMapMarker(x, y, shop)
//   }
// }
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
      value: '',
      slots: [
        {
          flex: 1,
          values: ['2015-01', '2015-02', '2015-03', '2015-04', '2015-05', '2015-06'],
          className: 'slot1',
          textAlign: 'right'
        },
        {
          divider: true,
          content: '-',
          className: 'slot2'
        },
        {
          flex: 1,
          values: ['2015-01', '2015-02', '2015-03', '2015-04', '2015-05', '2015-06'],
          className: 'slot3',
          textAlign: 'left'
        }
      ]
    }
  },
  mounted() {
    // 取得vuex資料
    const geoData = this.$store.state.geo.position
    // 若無取得vuex資料 跳轉404

    // OSM Map
    const longitude = geoData.longitude || 120
    const latitude = geoData.latitude || 24
    osmMap = $L.map('map', {
      center: [latitude, longitude],
      zoom: 15
    })
    $L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '<a target="_blank" href="https://www.openstreetmap.org/">© OpenStreetMap 貢獻者</a>',
      maxZoom: 18
    }).addTo(osmMap)
  },
  methods: {
    onValuesChange(picker, values) {
      console.log(1)

      if (values[0] > values[1]) {
        picker.setSlotValue(1, values[0])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/shop/_shop.scss';
</style>
