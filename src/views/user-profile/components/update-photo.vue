<template>
<div class="update-photo">
  <img class="img" :src="img" ref="img">

  <div class="toolbar">
    <div class="cancel" @click="$emit('close')">取消</div>
    <div class="confirm" @click="onConfirm">完成</div>
  </div>

</div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/api/user'

  export default {
    name: 'UpdatePhoto',
    components: {},
    props: {
      img: {
        type: [String, Object],
        required: true
      }
    },
    data() {
      return {
        cropper: null
      }
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
      const image = this.$refs.img;
      this.cropper = new Cropper(image, {
        viewMode: 1, // 查看模式默认是 0超出区域外，值设置为1在画布当中
        dragMode: 'move', // 拖动模式
        aspectRatio: 1, // 截图的比例 1:1
        // autoCropArea: 1, // 自动截取区域 设置为 1:1
        cropBoxMovable: false, // 截图区域是否可以移动
        cropBoxResizable: false, // 截图的缩放
        background: false, // 背景
        movable: true // 设置画布是否可以移动 默认就是true
      })
    },
    methods: {
      // 例如方形画布的左上角是圆点，右边x轴，下边y轴
      onConfirm () {
        // 基于服务端的裁切使用 getData 方法获取裁切参数
        // console.log(this.cropper.getData());

        // 纯客户端的裁切使用 getCroppedCanvas 获取裁切的文件对象
        this.cropper.getCroppedCanvas().toBlob(blob => {
          this.updateUserPhoto(blob)
        })
      },

      async updateUserPhoto (blob) {
        this.$toast.loading({
          message: '保存中...',
          forbidClick: true, // 禁止背景点击
          duration: 0 // 持续展示
        })
        try {
          // 错误的用法
          // 如果接口要求 Content-Type 是 application/json
          // 则传递普通 JavaScript 对象
          // updateUserPhoto({
          //   photo: blob
          // }) 

          // 如果接口要求 Content-Type 是 multipart/form-data
          // 则你必须传递 FormData 对象
        const formData = new FormData()
        formData.append('photo', blob)

        const { data } = await updateUserPhoto(formData)

        // 关闭弹出层
        this.$emit('close')

        // 更新视图
        this.$emit('update-photo', data.data.photo)

        // 提示成功
        this.$toast.success('更新成功')
        } catch (err) {
          this.$toast.fail('更新失败')
        }
      }
    }
  }
</script>

<style lang="less" scoped>
.update-photo {
  background-color: #000;
  height: 100%;
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel, .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
.img {
  display: block;
  max-width: 100%;
}
</style>