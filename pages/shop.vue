<template>
  <div class="map__container">
    <div class="map__list_container">
      <div class="map__list_selectCity">
        <div class="map__list_city">
          <span class="map__list_city_title">請選擇城市:</span>
          <el-select v-model="form.curCity" placeholder="請選擇縣市" @change="getAllShop">
            <el-option
              v-for="city in allCity"
              :key="city.CityName"
              :label="city.CityName"
              :value="city.CityName"
            ></el-option>
          </el-select>
        </div>
        <div class="map__list_area">
          <span class="map__list_area_title">請選擇區域:</span>
          <el-select v-model="form.curArea" placeholder="請選擇地區" @change="updateShop">
            <el-option value="選擇全區"></el-option>
            <el-option
              v-for="area in allArea"
              :key="area.AreaName"
              :label="area.AreaName"
              :value="area.AreaName"
            ></el-option>
          </el-select>
        </div>
      </div>
      <!-- 手機選單 -->
      <div class="mobile__map__list_selectCity">
        <!-- <mt-picker :slots="slots" @change="onValuesChange"></mt-picker> -->
        <select id="select_city" v-model="form.curCity" name="selectCity" @change="getAllShop">
          <option
            v-for="city in allCity"
            :key="city.CityName"
            :label="city.CityName"
            :value="city.CityName"
          >{{ city.CityName }}</option>
        </select>
        <select id="select_area" v-model="form.curArea" name="selectArea" @change="updateShop">
          <option value="選擇全區">選擇全區</option>
          <option
            v-for="area in allArea"
            :key="area.AreaName"
            :label="area.AreaName"
            :value="area.AreaName"
          >{{ area.AreaName }}</option>
        </select>
      </div>
      <div class="map__list_searchResult">
        <span class="map__list_searchResult_result">搜尋結果：共 {{ filterShopList.length }} 家店家</span>
      </div>
      <!-- 商家列表 -->
      <div ref="showShopList" class="map__list_showShop">
        <div v-for="list in filterShopList" :key="list.ID" class="map__list_showShop_list">
          <h3 class="map__list_showShop_list_title">
            {{ list.Name }}&emsp;
            <fa
              style="cursor:pointer"
              :icon="['fas', 'map-marker-alt']"
              @click.stop="moveToShop(list.Position.PositionLon, list.Position.PositionLat, list)"
            />
          </h3>
          <div class="map__list_showShop_list_address">
            地址:&nbsp;
            <br />
            <br />
            <a
              :href="`https://www.google.com.tw/maps/place/${list.Address}`"
              target="_blank"
              class="map__list_showShop_list_address_link"
            >{{ list.Address }}</a>
          </div>
          <div class="map__list_showShop_list_phone">
            電話:&nbsp;
            <br />
            <br />
            <a href="javascript:;" class="map__list_showShop_list_phone_link">{{ list.Phone }}</a>
          </div>
        </div>
        <div v-if="filterShopList.length === 0" class="map__list_showShop_list">
          <h3>查無此區的商家資訊</h3>
        </div>
      </div>
    </div>
    <div class="map__shopMap_container">
      <div id="map"></div>
    </div>
    <!-- 聊天室 -->
    <chat />
  </div>
</template>

<script>
import { Loading } from 'element-ui'
import allCity from '@/assets/json/allCity.json'
import Chat from '@/components/chat/index'

// 解決組件初始化抓不到windows物件
let $L
if (process.client) {
  $L = require('leaflet')
}

// OSM Map init
let osmMap = {}
// OSM config methods
const osmConfig = {
  addMapMarker(x, y, shop) {
    $L.marker([y, x]).addTo(osmMap).bindPopup(`<strong>${shop.Name}</strong><br>
      地址: <a href="https://www.google.com.tw/maps/place/${shop.Address}" target="_blank">${shop.Address}</a><br>
      電話: ${shop.Phone}<br>`)
  },
  removeMapMarker() {
    osmMap.eachLayer(layer => {
      if (layer instanceof $L.Marker) {
        osmMap.removeLayer(layer)
      }
    })
  },
  panTo(x, y, shop) {
    osmMap.panTo(new $L.LatLng(y, x))
    this.addMapMarker(x, y, shop)
  }
}

export default {
  components: {
    Chat
  },
  async asyncData({ app }) {
    const geoData = app.store.state.geo.position
    if (!geoData) {
      return {
        form: {
          curCity: '',
          curArea: '',
          curCityEngName: '',
          curAreaZipCode: ''
        },
        allCity,
        allArea: [],
        shopList: [],
        filterShopList: [],
        slots: [
          {
            flex: 1,
            values: [],
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
            values: [],
            className: 'slot3',
            textAlign: 'left'
          }
        ]
      }
    }
    // 下拉選單預設值
    let curCity = allCity.filter(city => city.CityEngName.match(geoData.city))[0]
    let geoZip = geoData.zip

    // 防止所在地區的ip不在city data中
    // 預設顯示台中大里
    if (curCity.length === 0) {
      curCity = allCity.filter(city => city.CityEngName.match('Taichung'))[0]
      geoZip = '412'
    }

    // 整理return data
    const allArea = curCity.AreaList
    const curArea = curCity.AreaList.filter(area => area.ZipCode === geoZip)[0]
    // mobile mint-ui 選單值
    const mobileSelectCity = allCity.map(city => city.CityName)
    const mobileSelectArea = allArea.map(area => area.AreaName)
    mobileSelectArea.unshift('選擇全區')
    const mobileDefaultCityIndex = allCity
      .map(city => city.CityName)
      .indexOf(curCity.CityName)
    const mobileDefaultAreaIndex = mobileSelectArea.indexOf(curArea.AreaName)

    // 撈取預設位置店家資訊
    const { data: shopList } = await app.$axios.get(
      `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/${curCity.CityEngName}?$top=100&$format=JSON`
    )

    const formatShopList = shopList.filter(shop => {
      return shop.Address.match(curArea.ZipCode) || shop.ZipCode === curArea.ZipCode
    })

    return {
      form: {
        curCity: curCity.CityName,
        curCityEngName: curCity.CityEngName,
        curArea: curArea.AreaName,
        curAreaZipCode: curArea.ZipCode
      },
      allCity,
      allArea,
      shopList,
      filterShopList: formatShopList,
      slots: [
        {
          flex: 1,
          values: mobileSelectCity,
          defaultIndex: mobileDefaultCityIndex,
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
          values: mobileSelectArea,
          defaultIndex: mobileDefaultAreaIndex,
          className: 'slot3',
          textAlign: 'left'
        }
      ]
    }
  },
  watch: {
    'form.curCity': {
      handler() {
        // 先清空area
        this.form.curArea = '選擇全區'
        if (this.allCity) {
          // 更改當前城市區域列表
          this.allArea = this.allCity.filter(
            item => item.CityName === this.form.curCity
          )[0].AreaList
          // 更改當前城市英文名稱
          this.form.curCityEngName = this.allCity.filter(
            item => item.CityName === this.form.curCity
          )[0].CityEngName
        }
      }
    },
    'form.curArea': {
      handler() {
        const area = this.allArea.filter(area => area.AreaName === this.form.curArea)
        if (area.length !== 0) {
          this.form.curAreaZipCode = area[0].ZipCode
        }
      }
    }
  },
  mounted() {
    // 取得vuex資料
    const geoData = this.$store.state.geo.position
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

    // 移除每一個圖層
    osmMap.eachLayer(layer => {
      if (layer instanceof $L.Marker) {
        osmMap.removeLayer(layer)
      }
    })

    // 增加map marker 並移動至該區域
    this.filterShopList.forEach(shop => {
      osmConfig.addMapMarker(shop.Position.PositionLon, shop.Position.PositionLat, shop)
      osmConfig.panTo(shop.Position.PositionLon, shop.Position.PositionLat, shop)
    })
  },
  methods: {
    getAllShop() {
      // 顯示laoding
      const loadingInstance = Loading.service({
        target: '.map__container',
        text: '載入商家...'
      })

      this.$nextTick(async () => {
        // 獲取觀光商家api
        const self = this
        const { data: shopList } = await self.$axios.get(
          `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/${self.form.curCityEngName}?$top=100&$format=JSON`
        )

        // 移除每一個圖層
        osmMap.eachLayer(layer => {
          if (layer instanceof $L.Marker) {
            osmMap.removeLayer(layer)
          }
        })

        // 增加map marker 並移動至該區域
        shopList.forEach(shop => {
          osmConfig.addMapMarker(
            shop.Position.PositionLon,
            shop.Position.PositionLat,
            shop
          )
          osmConfig.panTo(shop.Position.PositionLon, shop.Position.PositionLat, shop)
        })
        self.shopList = shopList
        self.filterShopList = shopList
        // 預設選取全區
        // self.form.curCity = '選擇全區'

        loadingInstance.close()
        self.$refs.showShopList.scrollTop = 0
      })
    },
    updateShop() {
      // 選擇顯示全區商家
      if (this.form.curArea === '選擇全區') {
        this.getAllShop()
      }

      // 顯示laoding
      const loadingInstance = Loading.service({
        target: '.map__container',
        text: '載入商家...'
      })

      this.$nextTick(() => {
        // 篩選出該城市地區的商家
        const filterShopList = this.shopList.filter(shop => {
          return (
            shop.Address.match(this.form.curAreaZipCode) ||
            shop.Address.match(this.form.curArea) ||
            (shop.ZipCode === this.form.curAreaZipCode &&
              shop.Address.match(this.form.curArea))
          )
        })

        // 移除每一個圖層
        osmMap.eachLayer(layer => {
          if (layer instanceof $L.Marker) {
            osmMap.removeLayer(layer)
          }
        })

        // 增加map marker 並移動至該區域
        filterShopList.forEach(shop => {
          osmConfig.addMapMarker(
            shop.Position.PositionLon,
            shop.Position.PositionLat,
            shop
          )
          osmConfig.panTo(shop.Position.PositionLon, shop.Position.PositionLat, shop)
        })

        // 更新商家資訊卡
        this.filterShopList = filterShopList

        loadingInstance.close()
        this.$refs.showShopList.scrollTop = 0
      })
    },
    moveToShop(lon, lat, shop) {
      osmMap.panTo(new $L.LatLng(lat, lon))
      $L.popup()
        .setLatLng([lat, lon])
        .setContent(
          `<strong>${shop.Name}</strong><br>
      地址: <a href="https://www.google.com.tw/maps/place/${shop.Address}" target="_blank">${shop.Address}</a><br>
      電話: ${shop.Phone}<br>`
        )
        .openOn(osmMap)
      const target = window.document.documentElement || window.document.body
      target.scrollTo(0, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/shop/_shop.scss';
</style>
