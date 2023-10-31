<template>
  <view class="fix-top-window">
		<view class="uni-header">
			<uni-stat-breadcrumb class="uni-stat-breadcrumb-on-phone" />
			<view class="uni-group">
				<input class="uni-search" type="text" />
				<button class="uni-button hide-on-phone" type="default" size="mini">{{$t('common.button.search')}}</button>
				<button class="uni-button" type="primary" size="mini">{{$t('common.button.add')}}</button>
				<button class="uni-button" type="warn" size="mini">{{$t('common.button.batchDelete')}}</button>
				<!-- #ifdef H5 -->
				<!-- <download-excel class="hide-on-phone" :fields="exportExcel.fields" :data="exportExcelData"
					:type="exportExcel.type" :name="exportExcel.filename">
					<button class="uni-button" type="primary" size="mini">{{$t('common.button.exportExcel')}}</button>
				</download-excel> -->
				<!-- #endif -->
			</view>
		</view>
		<view class="uni-container">
			<unicloud-db ref="udb" v-slot:default="{data, pagination, loading, hasMore, error}" :collection="collectionList" field="_id,title,type,start,end,content">
			  <uni-table ref="table" :loading="loading" :emptyText="error.message || $t('common.empty')" border stripe
			  	type="selection">
					<uni-tr>
						<uni-th align="center">标题</uni-th>
						<uni-th align="center">类型</uni-th>
						<uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'start')"
							sortable @sort-change="sortChange($event, 'start')">开始时间</uni-th>
						<uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'end')"
							sortable @sort-change="sortChange($event, 'end')">结束时间</uni-th>
						<uni-th align="center">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item,index) in data" :key="index">
						<uni-td align="center">{{item.title}}</uni-td>
						<uni-td align="center">{{item.type ? '普通通知' : '放假通知'}}</uni-td>
						<uni-td align="center">{{item.start}}</uni-td>
						<uni-td align="center">{{item.end}}</uni-td>
						<uni-td align="center">
							<view class="uni-group">
								<button @click="navigateTo('./edit?id='+item._id, false)" class="uni-button" size="mini"
									type="primary">{{$t('common.button.edit')}}</button>
								<button @click="confirmDelete(item._id)" class="uni-button" size="mini"
									type="warn">{{$t('common.button.delete')}}</button>
							</view>
						</uni-td>
					</uni-tr>
				</uni-table>
				<view class="uni-pagination-box">
					<uni-pagination show-icon show-page-size :page-size="pagination.size" v-model="pagination.current"
						:total="pagination.count" @change="onPageChanged" @pageSizeChange="changeSize"/>
				</view>
			</unicloud-db>
		</view>
  </view>
</template>

<script>
  const db = uniCloud.database()
  export default {
    data() {
      return {
        collectionList: "webnotice",
        loadMore: {
          contentdown: '',
          contentrefresh: '',
          contentnomore: ''
        }
      }
    },
    onPullDownRefresh() {
      this.$refs.udb.loadData({
        clear: true
      }, () => {
        uni.stopPullDownRefresh()
      })
    },
    onReachBottom() {
      this.$refs.udb.loadMore()
    },
    methods: {
      handleItemClick(id) {
        uni.navigateTo({
          url: './detail?id=' + id
        })
      },
      // fabClick() {
      //   // 打开新增页面
      //   uni.navigateTo({
      //     url: './add',
      //     events: {
      //       // 监听新增数据成功后, 刷新当前页面数据
      //       refreshData: () => {
      //         this.$refs.udb.loadData({
      //           clear: true
      //         })
      //       }
      //     }
      //   })
      // }
    }
  }
</script>

<style>
</style>
