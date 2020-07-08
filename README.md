# iSweetaste
微型電商平台，參考六角學院甜點電商活動設計稿，不依賴CSS框架完成RWD設計。前端框架採用NuxtJS作SSR，後端使用NodeJS配Express框架實作電商平台常見的功能。

<a href="https://xd.adobe.com/spec/934efdb7-a7e4-47d5-572e-efece0914f62-e57f/grid">原始設計稿參照</a>

# 使用技術

<ul>
  <li>前端框架: NuxtJS</li>
  <li>後端框架: Express</li>
  <li>聊天室實作: Socket.IO</li>
  <li>資料庫: MongoDB、Redis</li>
  <li>後端驗證: Passport</li>
  <li>OSM(OpenStrteetMap) API使用、政府公開資訊API串接</li>
</ul>

# 功能介紹

- [x] 使用Passport搭配Redis實作會員註冊/登入功能
- [x] OSM搭配政府Open Source API實作搜尋附近商家功能
- [x] Socket.IO實作客服線上簡易聊天室功能
- [x] 使用者可以登入修改暱稱、上傳大頭貼


<a href="https://jameslin-isweetaste.herokuapp.com/">Demo</a>
