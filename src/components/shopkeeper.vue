<template>
  <div class="shopkeeper" flexContainer @touchmove.prevent>
    <div class="title">
      <span></span>
    </div>
    <div class="input-info">
      <div class="info">
        <div class="name">
          <input type="text" name="name" id="name" value="" v-model="name" placeholder="姓名">
        </div>
        <div class="phone">
          <input type="text" name="phone" id="phone" maxlength="11" value="" v-model="phone"  placeholder="手机号码">
        </div>
      </div>
      <div class="address">
        <input type="text" name="address" id="address" value="" v-model="address"  placeholder="店铺地址">
      </div>
    </div>
    <div class="shop">
      <h2>店铺图片</h2>
      <div class="con">
        <div class="left">
          <span>示例图片</span>
        </div>
        <div class="right">
          <label for="shop" class="btn" v-if="shopImg !== ''"></label>
          <label for="shop" class="defaultimg" :class="{'nobg': shopImg !== ''}">
            <input type="file" class="head_file" id="shop" ref="shopimg" @change="onChange(0)" style="display: none" accept="image/*">
            <div class="shopimg" v-if="shopImg !== ''" @click.prevent>
              <img :src="shopImg" alt="">
            </div>
          </label>
        </div>
      </div>
    </div>
    <div class="dsf" v-if="upLoadType === '1'">
      <h2>营业执照 </h2>
      <div class="con">
        <div class="left">
          <span>示例图片</span>
        </div>
        <div class="right">
          <label for="idcard" class="btn"  v-if="cardImg !== ''"></label>
          <label for="idcard" class="defaultimg" :class="{'nobg': cardImg !== ''}">
            <input type="file" class="head_file" id="idcard" ref="idcard" @change="onChange(1)" style="display: none" accept="image/*">
            <div class="shopimg" v-if="cardImg !== ''">
              <img :src="cardImg" alt="">
            </div>
          </label>
        </div>
      </div>
    </div>
    <div class="box">

    </div>
    <div class="submit" @click="submit">
    </div>
    <transition name="fade">
      <div class="message" v-show="messState">
        {{message}}
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import Exif from 'exif-js'
export default {
  name: 'shopkeeper',
  data () {
    return {
      upLoadType: 1,
      shopId: '',
      cardId: '',
      name: '',
      phone: '',
      address: '',
      message: '',
      timer: null,
      messState: false,
      shopImg: '',
      cardImg: '',
      picValue: '',
      formData: ''
    }
  },
  watch: {
    messState: function (newQuestion, oldQuestion) {
      if (!oldQuestion) {
        this.timer = setTimeout(() => {
          this.messState = false
        }, 2000)
      }
    }
  },
  methods: {
    submit () {
      this.message = ''
      if (this.name.length < 2 || this.name.length > 6) {
        this.message = '姓名格式不正确'
        this.messState = true
      } else if (!(/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(17([0-1,3]|[6-8]))|(18[0-9]))\d{8}$/.test(this.phone))) {
        this.message = '手机格式不正确'
        this.messState = true
      } else if (this.address.length < 1) {
        this.message = '请输入详细地址'
        this.messState = true
      } else if (!this.shopId) {
        this.message = '请上传门店照片'
        this.messState = true
      } else if (!this.cardId && this.upLoadType === 1) {
        this.message = '请上传营业执照'
        this.messState = true
      } else {
        this.api_post('/api/wxPubilc/joinUS', (response) => {
          if (response.errorCode === 0) {
            this.$router.replace('/success')
          } else {
            this.message = '网络错误请重新提交'
            this.messState = true
          }
        }, {
          userName: this.name,
          cellphone: this.phone,
          shopPictures: this.shopId,
          shopAddress: this.address,
          type: this.upLoadType,
          businessLicense: this.cardId
        })
      }
    },
    onChange (id) {
      this.formData = new FormData()
      if (id === 0) {
        this.picValue = this.$refs.shopimg.files[0]
      } else if (id === 1) {
        this.picValue = this.$refs.idcard.files[0]
      }
      if (this.picValue) {
        this.formData.append('img1', this.picValue)
        this.imgPreview(this.picValue, id)
      }
    },
    imgPreview (file, id) {
      let self = this
      let Orientation
      // 去获取拍照时的信息，解决拍出来的照片旋转问题
      Exif.getData(file, function () {
        Orientation = Exif.getTag(this, 'Orientation')
      })
      // 看支持不支持FileReader
      if (!file || !window.FileReader) return

      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader()
        // 将图片2将转成 base64 格式
        reader.readAsDataURL(file)
        // 读取成功后的回调
        reader.onloadend = function () {
          let result = this.result
          let img = new Image()
          img.src = result
          // 判断图片是否大于100K,否就直接上传，反之压缩图片
          if (this.result.length <= (100 * 1024)) {
            console.log(id, this.result)
            if (id === 0) {
              self.shopImg = this.result
            } else if (id === 1) {
              self.cardImg = this.result
            }
            self.postImg(id)
          } else {
            img.onload = function () {
              let data = self.compress(img, Orientation)
              if (id === 0) {
                self.shopImg = data
              } else if (id === 1) {
                self.cardImg = data
              }
              console.log(self.cardImg === self.shopImg)
              self.postImg(id)
            }
          }
        }
      }
    },
    postImg (id) {
      // 这里写接口
      this.api_file('/api/common/upload', this.formData, (response) => {
        if (response.errorCode === 0) {
          if (id === 0) {
            this.shopId = response.data.id
          } else if (id === 1) {
            this.cardId = response.data.id
          }
        }
      })
    },
    rotateImg (img, direction, canvas) {
      // 最小与最大旋转方向，图片旋转4次后回到原方向
      const minStep = 0
      const maxStep = 3
      if (img === null) return
      // img的高度和宽度不能在img元素隐藏后获取，否则会出错
      let height = img.height
      let width = img.width
      let step = 2
      if (step === null) {
        step = minStep
      }
      if (direction === 'right') {
        step++
        // 旋转到原位置，即超过最大值
        step > maxStep && (step = minStep)
      } else {
        step--
        step < minStep && (step = maxStep)
      }
      // 旋转角度以弧度值为参数
      let degree = step * 90 * Math.PI / 180
      let ctx = canvas.getContext('2d')
      switch (step) {
        case 0:
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0)
          break
        case 1:
          canvas.width = height
          canvas.height = width
          ctx.rotate(degree)
          ctx.drawImage(img, 0, -height)
          break
        case 2:
          canvas.width = width
          canvas.height = height
          ctx.rotate(degree)
          ctx.drawImage(img, -width, -height)
          break
        case 3:
          canvas.width = height
          canvas.height = width
          ctx.rotate(degree)
          ctx.drawImage(img, -width, 0)
          break
      }
    },
    compress (img, Orientation) {
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      // 瓦片canvas
      let tCanvas = document.createElement('canvas')
      let tctx = tCanvas.getContext('2d')
      let initSize = img.src.length
      let width = img.width
      let height = img.height
      // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio
      if ((ratio = width * height / 4000000) > 1) {
        console.log('大于400万像素')
        ratio = Math.sqrt(ratio)
        width /= ratio
        height /= ratio
      } else {
        ratio = 1
      }
      canvas.width = width
      canvas.height = height
      // 铺底色
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      // 如果图片像素大于100万则使用瓦片绘制
      let count
      if ((count = width * height / 1000000) > 1) {
        console.log('超过100W像素')
        count = ~~(Math.sqrt(count) + 1)
        // 计算要分成多少块瓦片
        // 计算每块瓦片的宽和高
        let nw = ~~(width / count)
        let nh = ~~(height / count)
        tCanvas.width = nw
        tCanvas.height = nh
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height)
      }
      // 修复ios上传图片的时候 被旋转的问题
      if (Orientation !== '' && Orientation !== 1) {
        switch (Orientation) {
          case 6:
            // 需要顺时针（向左）90度旋转
            this.rotateImg(img, 'left', canvas)
            break
          case 8:
            // 需要逆时针（向右）90度旋转
            this.rotateImg(img, 'right', canvas)
            break
          case 3:
            // 需要180度旋转
            this.rotateImg(img, 'right', canvas)
            // 转两次
            this.rotateImg(img, 'right', canvas)
            break
        }
      }
      // 进行最小压缩
      let ndata = canvas.toDataURL('image/jpeg', 0.1)
      console.log('压缩前：' + initSize)
      console.log('压缩后：' + ndata.length)
      console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + '%')
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
      return ndata
    }
  },
  mounted () {
    this.upLoadType = this.$route.query.id
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" ref="stylesheet/stylus">
  @import "../common/stylus/index.styl"
  .fade-enter-active, .fade-leave-active
    transition: opacity .5s
  .fade-enter, .fade-leave-to
    opacity: 0
  .shopkeeper
    position: relative
    min-height: 100vh
    background-color: #ffffff
    flex-direction: column
    padding-top: 30px
    .message
      display: inline-block
      position: absolute
      left: 0
      right: 0
      top: 0
      bottom: 0
      margin: auto
      width: 300px
      height: 60px
      text-align: center
      line-height: 60px
      border-radius: 5px
      background-color: rgba(0,0,0,0.7)
      font-size: 24px
      color: #fff
      z-index: 100
    .title
      height: 100px
      padding: 0px 30px
      margin-bottom: 24px
      & > span
        display: inline-block
        width: 360px
        height: 100px
        bg-image('../common/imgs/biao')
        background-size: 360px 46px
        background-repeat: no-repeat
        background-position: left center
    .input-info
      display: flex
      flex-direction: column
      height: 202px
      border-bottom: 1px solid #b4b4b4
      border-top: 1px solid #b4b4b4
      .info
        display: flex
        height: 100px
        border-bottom: 1px solid #b4b4b4
        .name, .phone
          flex: 1
          display: flex
          line-height: 100px
          padding-left: 30px
          overflow: hidden
          color: #000
          & > input
            width: 100%
            border: none
            background: none
            outline: none
            font-size: 30px
            color: #505050
          & > input::-webkit-input-placeholder
            color: #b4b4b4
        .name
          border-right: 1px solid #b4b4b4
        .phone
          flex: 1
      .address
        position: relative
        flex: 1
        display: flex
        padding-left: 30px
        line-height: 100px
        overflow: hidden
        & > input
          flex: 1
          border: none
          background: none
          outline: none
          font-size: 30px
          color: #505050
        & > input::-webkit-input-placeholder
          color: #b4b4b4
    .shop, .dsf
      height: 315px
      display: flex
      flex-direction: column
      padding: 17px 30px 0px 30px
      h2
        font-size: 36px
        color: #505050
        font-weight: 600
        line-height: 87px
      .con
        flex: 1
        display: flex
        .left
          position: relative
          width: 360px
          span
            position: absolute
            bottom: 0
            left: 0
            display: inline-block
            width: 330px
            height: 40px
            background-color: rgba(0, 0, 0, 0.3)
            font-size: 22px
            color: #fff
            text-align: center
            line-height: 40px
        .right
          flex: 1
        .left, .right
          .btn
            position: absolute
            right: 0px
            top: -20px
            z-index: 1000
            display: inline-block
            width: 82px
            height: 50px
            float: right
            bg-image('../common/imgs/huan')
            background-size: 82px 50px
            background-repeat: no-repeat
            background-position: center center
    .shop
      .left
        bg-image('../common/imgs/md')
        background-size: 330px 214px
        background-repeat: no-repeat
        background-position: left top
      .right
        position: relative
        display: flex
        .defaultimg
          flex: 1
          bg-image('../common/imgs/dp')
          background-size: 330px 214px
          background-repeat: no-repeat
          background-position: left top
          &.nobg
            background: none
        .shopimg
          position: absolute
          left: 0
          top: 0
          width: 100%
          height: 214px
          z-index: 0
          img
            display: block
            width: 100%
            height: 100%
            object-fit: cover
    .dsf
      .left
        bg-image('../common/imgs/card')
        background-size: 330px 214px
        background-repeat: no-repeat
        background-position: left top
      .right
        position: relative
        display: flex
        .defaultimg
          flex: 1
          bg-image('../common/imgs/yy')
          background-size: 330px 214px
          background-repeat: no-repeat
          background-position: left top
          &.nobg
            background: none
        .shopimg
          position: absolute
          left: 0
          top: 0
          width: 100%
          height: 214px
          z-index: 0
          img
            display: block
            width: 100%
            height: 100%
            object-fit: cover
    .box
      flex: 1
    .submit
      height: 100px
      bg-image('../common/imgs/submit')
      background-size: 750px 100px
      background-repeat: no-repeat
      background-position: center center
</style>
