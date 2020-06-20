<template>
  <div class="profile_container">
    <div class="profile_title">
      <h3>編輯個人檔案</h3>
      <button class="save_porfileBtn" @click="saveEditUser">儲存</button>
    </div>
    <div class="profile_edit_section">
      <div class="profile_edit_section-userInfo">
        <div class="user_account">
          <div class="label">
            <label>使用者帳號</label>
          </div>
          <div class="user_email">{{ userEmail }}</div>
        </div>
        <div class="edit_username">
          <div class="label">
            <label>修改使用者名稱</label>
          </div>
          <div class="edit_username-input">
            <input v-model="changeName" type="text" />
          </div>
        </div>
      </div>
      <div class="profile_edit_section-avatar">
        <div class="avatar-uploader_container">
          <div ref="avatar" class="avatar-uploader_img" :style="styleObject">
            <input
              ref="upload_img_avatar"
              style="position:relative;opacity:0;cursor:pointer;width:100%;height:100%"
              type="file"
              accept=".jpeg,.png,.jpg,.svg"
              @change="avatarPreview"
            />
          </div>
          <div class="avatar-uploader_submitBtn">
            <label class="submit-btn">
              <input
                ref="upload_img_input"
                style="display:none;"
                type="file"
                accept=".jpeg,.png,.jpg"
                @change="avatarPreview"
              />
              選擇圖片
            </label>
          </div>
          <div class="avatar-uplaoder_limit">
            <p>檔案大小:最大1MB</p>
            <p>檔案限制:.JPEG, .PNG</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Loading } from 'element-ui'

export default {
  async asyncData({ app }) {
    const userId = app.store.state.user.user.id
    const { status, data } = await app.$axios.get(`/users/${userId}/avatar`)

    if (data.msg && data.ret_code === -1) {
      return {
        styleObject: {
          background: `url(${require('@/assets/img/avatar/user.png')})`
        }
      }
    }

    if (status === 200 && data) {
      return {
        styleObject: {
          background: `url(/users/${userId}/avatar)`
        }
      }
    }
  },
  data() {
    return {
      changeName: '',
      previewImgSrc: ''
    }
  },
  computed: {
    userEmail() {
      return this.$store.state.user.user.email
    },
    userId() {
      return this.$store.state.user.user.id
    }
  },
  methods: {
    async saveEditUser() {
      const uploadImg =
        this.$refs.upload_img_input.files[0] || this.$refs.upload_img_avatar.files[0]
      if (!uploadImg && this.changeName === '') return false
      // 顯示laoding
      const loadingInstance = Loading.service({
        target: '.profile_edit_section'
      })

      if (uploadImg) {
        // 上傳avatar
        const formData = new FormData()
        formData.append('avatar', uploadImg)

        const {
          status,
          data: { updatedUser, msg }
        } = await this.$axios.post(`/users/${this.userId}/avatar`, formData, {
          headers: { 'content-type': 'multipart/form-data' }
        })
        if (status !== 200 || !updatedUser) {
          loadingInstance.close()
          alert(msg)
          return false
        }
        // 更新vuex
        this.$store.commit('user/changeAvatar', this.previewImgSrc)
      }

      if (this.changeName !== '') {
        // 更新使用者姓名
        const { status: updateUserNameStatus, data } = await this.$axios.post(
          `/users/${this.userId}/changeUserName`,
          {
            changeName: encodeURIComponent(this.changeName)
          }
        )

        if (updateUserNameStatus !== 200 || data.ret_code === -1) {
          loadingInstance.close()
          alert(data.msg)
          return false
        }
        // 更新vuex
        this.$store.commit('user/changeUserName', this.changeName)
        this.changeName = ''
      }

      loadingInstance.close()
      alert('成功儲存個人檔案！')
    },
    avatarPreview(e) {
      const self = this
      const uploadImg = e.target.files[0]

      const newImg = new Image()

      if (!uploadImg) return false
      const reader = new FileReader()
      reader.onload = function(evt) {
        newImg.src = evt.target.result
        self.previewImgSrc = evt.target.result
        self.drawAvatarPreview(newImg)
      }

      reader.readAsDataURL(uploadImg)
    },
    // 上傳後預覽圖描繪
    drawAvatarPreview(img) {
      const self = this
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const compressRatio = 0.8

      img.onload = function() {
        const newBGWidth = 100
        const newBGHeight = (newBGWidth * img.height) / img.width
        canvas.height = newBGHeight
        canvas.width = newBGWidth
        ctx.drawImage(img, 0, 0, newBGWidth, newBGHeight)
        const newBGUrl = canvas.toDataURL('image/png', compressRatio)
        self.$refs.avatar.style.background = `url(${newBGUrl})`
        self.$refs.avatar.style.borderRadius = '50%'
        self.$refs.avatar.style.backgroundPosition = '50% 50%'
        self.$refs.avatar.style.backgroundSize = 'cover'
        self.$refs.avatar.style.backgroundRepeat = 'no-repeat'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/profile/_profile.scss';
</style>
