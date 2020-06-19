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
            <input type="text" />
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
              @change="avatarPreview"
            />
          </div>
          <div class="avatar-uploader_submitBtn">
            <label class="submit-btn">
              <input
                ref="upload_img_input"
                style="display:none;"
                type="file"
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
export default {
  computed: {
    userEmail() {
      return this.$store.state.user.user.email
    },
    userId() {
      return this.$store.state.user.user.id
    },
    styleObject() {
      return {
        background: `url('http://localhost:3000/users/${this.userId}/avatar')`,
        borderRadius: '50%',
        backgroundPosition: '50%',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        cursor: 'pointer'
      }
    }
  },
  methods: {
    async saveEditUser() {
      const uploadImg =
        this.$refs.upload_img_input.files[0] || this.$refs.upload_img_avatar.files[0]
      if (!uploadImg) return false
      const formData = new FormData()
      formData.append('avatar', uploadImg)
      const {
        status,
        data: { updatedUser }
      } = await this.$axios.post(`/users/${this.userId}/avatar`, formData, {
        headers: { 'content-type': 'multipart/form-data' }
      })
      if (status === 200 && updatedUser) {
        alert('成功儲存個人檔案！')
      } else {
        alert('儲存個人檔案失敗！')
      }
    },
    avatarPreview(e) {
      const self = this
      const uploadImg = e.target.files[0]
      if (!uploadImg) return false
      const reader = new FileReader()
      reader.onload = function(evt) {
        self.$refs.avatar.style.background = `url(${evt.target.result})`
        self.$refs.avatar.style.borderRadius = '50%'
        self.$refs.avatar.style.backgroundPosition = '50%'
        self.$refs.avatar.style.backgroundSize = 'cover'
        self.$refs.avatar.style.backgroundRepeat = 'no-repeat'
        self.$refs.avatar.style.cursor = 'pointer'
      }
      reader.readAsDataURL(uploadImg)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/profile/_profile.scss';
</style>
