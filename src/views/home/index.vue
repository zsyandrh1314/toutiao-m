<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button 
      class="search-btn"
      slot="title"
      type="info"
      size="small"
      round
      icon="search"
      to="/search"
      >搜索</van-button>
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 频道列表 -->
    <!-- 
       通过 v-model 绑定当前激活标签对应的索引值，默认情况下启用第一个标签
       通过 animated 属性可以开启切换标签内容时的转场动画。
       通过 swipeable 属性可以开启滑动切换标签页。
    -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >

      <!-- 频道的文章列表 -->
       <article-list ref="article-list" :channel="channel" />
      <!-- /频道的文章列表 -->
      </van-tab>

      <!-- 占位符 -->
      <div slot="nav-right" class="placeholder"></div>
      <!-- 汉堡下拉菜单 标题右侧内容-->
      <div 
      slot="nav-right" 
      class="hamburger-btn"
      @click="isChennelEditShow = true"
      >
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- / 频道列表 -->


    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChennelEditShow"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
    >
    <!-- 频道编辑弹出层的详情组件 -->
      <channel-edit
        :my-channels="channels"
        :active="active"
        @update-active="onUpdateActive"
      />
    </van-popup>
    <!-- /频道编辑弹出层 -->
  </div>
</template>

<script>
import {getUserChannels} from '@/api/user'
import ArticleList from './components/article-list.vue'
import ChannelEdit from './components/channel-edit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'

export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data () {
    return {
       active: 0,//控制被激活的标签项，其实就是索引
       channels:[],//频道列表
       isChennelEditShow: false // 控制编辑频道弹出层的显示状态
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadChannels()
  },
  mounted () {
    // window.home = this
  },
  methods: {
    async loadChannels () {
      try {
        // const { data } = await getUserChannels()
        // this.channels = data.data.channels
        let channels = []

        if (this.user) {
          // 已登录，请求获取用户频道列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          // 未登录，判断是否有本地的频道列表数据
          const localChannels = getItem('TOUTIAO_CHANNELS')
          //    有，拿来使用
          if (localChannels) {
            channels = localChannels
          } else {
            //    没有，请求获取默认频道列表
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }

        this.channels = channels
      } catch (err) {
        this.$toast('获取频道数据失败')
      }
    },

    onUpdateActive (index, isChennelEditShow = true) {
      // 更新激活的频道项
      this.active = index

      // 关闭编辑频道弹层
      this.isChennelEditShow = isChennelEditShow
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding-top: 174px;
  // 给个底边距，这样频道文章下拉显示没有更多了
  padding-bottom: 100px;
  // 1、导航栏
/deep/  .van-nav-bar__title {
    // 不设置父元素width ，使其子元素正常显示
    max-width: unset;
  }
  // 搜索按钮
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
// 2、频道列表
 /deep/ .channel-tabs {
  .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
    }
    // 样式
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-size: 30px;
      color: #777777;
    }

    // 频道列表被点击时的颜色
    .van-tab--active {
      color: #333333;
    }

    // 列表的父元素
    .van-tabs__nav {
      padding-bottom: 0;
    }
  
    // 列表底部条
    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }
    // 占位符
    .placeholder {
    flex-shrink: 0;
    width: 66px;
    height: 82px;
    }
// 汉堡包下拉框 三
  .hamburger-btn {
    position: fixed;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 66px;
    height: 82px;
    background-color: #fff;
    background-color: rgba(255, 255, 255, 0.902);
    i.toutiao {
      font-size: 33px;
    }
    // 汉堡包左边框
    &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 58px;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
    }
  }
} 
}

</style>
