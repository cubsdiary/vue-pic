<template>
  <div class="home" flexContainer @touchmove.prevent>
    <div class="img">
      <div class="title">
        <span>江苏奇特异车业科技股份有限公司</span>
        <span>热线电话：400&nbsp;&nbsp;180&nbsp;&nbsp;8811</span>
      </div>
    </div>
    <div class="con">
      <div class="logo">
        <span></span>
      </div>
      <div class="shop" @click="goShop">

      </div>
      <div class="dsf" @click="goDsf">

      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'home',
  methods: {
    goShop () {
      this.$router.push('/shopkeeper?id=' + 1)
    },
    goDsf () {
      this.$router.push('/shopkeeper?id=' + 2)
    }
  }
}
</script>
<style scoped lang="stylus" ref="stylesheet/stylus">
@import "../common/stylus/index.styl"
.home
  min-height: 100vh
  flex-direction: column
  background-color: #fff
  bg-image('../common/imgs/bg')
  background-size: 750px auto
  background-repeat: no-repeat
  background-position: center center
  overflow: hidden
  .img
    display: flex
    height: 443px
    flex-direction: column-reverse
    bg-image('../common/imgs/indexbg')
    background-size: 750px 443px
    background-repeat: no-repeat
    background-position: center center
    .title
      display: flex
      background-color: #2d2d2d
      height: 92px
      font-size: 22px
      color: #fff
      line-height: 92px
      padding: 0 30px
      span
        flex: 1
      span:nth-child(2)
        text-align: right
  .con
    flex: 1
    padding-top: 80px
    .logo
      display: flex
      align-items: center
      justify-content: center
      width: 486px
      height: 74px
      margin: 0 auto
      bg-image('../common/imgs/logo')
      background-size: 74px 74px
      background-repeat: no-repeat
      background-position: left center
      margin-bottom: 61px
      & > span
        width: 350px
        height: 74px
        bg-image('../common/imgs/main')
        background-size: 310px 46px
        background-repeat: no-repeat
        background-position: right center
    .shop
      width: 566px
      height: 170px
      margin: 0 auto
      margin-bottom: 38px
      bg-image('../common/imgs/aaa')
      background-size: 556px 170px
      background-repeat: no-repeat
      background-position: center center
    .dsf
      width: 566px
      height: 170px
      margin: 0 auto
      bg-image("../common/imgs/bbb")
      background-size: 556px 170px
      background-repeat: no-repeat
      background-position: center center
</style>
