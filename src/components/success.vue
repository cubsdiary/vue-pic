<template>
  <div class="success" flexContainer @touchmove.prevent>
    <div class="info">
      提交成功
    </div>
    <p class="text">
      我们的业务人员会在3个工作日内上门与您协商详细事宜，请保持手机畅通
    </p>
    <p class="phone">客服热线：&nbsp;&nbsp;400&nbsp;&nbsp;180&nbsp;&nbsp;8811</p>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'success',
  data () {
    return {
      timeOver: null
    }
  },
  mounted () {
    this.timerOver = setTimeout(() => {
      this.$router.replace('/')
    }, 3000)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" ref="stylesheet/stylus">
  @import "../common/stylus/index.styl"
  .success
    min-height: 100vh
    flex-direction: column
    background-color: #fff
    bg-image('../common/imgs/bg')
    background-size: 750px auto
    background-repeat: no-repeat
    background-position: center center
    padding-top: 122px
    overflow: hidden
    .info
      width: 292px
      padding-right: 17px
      text-align: right
      line-height: 70px
      font-size: 40px
      color: #474747
      font-weight: 600
      bg-image('../common/imgs/success')
      background-size: 68px 68px
      background-repeat: no-repeat
      background-position: left center
      margin: 0 auto
      margin-bottom: 69px
    .text
      width: 470px
      margin: 0 auto
      margin-bottom: 96px
      line-height: 35px
      font-size: 26px
      color: #505050
    .phone
      width: 500px
      line-height: 40px
      font-size: 26px
      color: #505050
      text-align: center
      margin: 0 auto
</style>
