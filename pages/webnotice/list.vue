<template>
  <view class="fix-top-window">
		<view class="uni-header">
			<uni-stat-breadcrumb class="uni-stat-breadcrumb-on-phone" />
			<view class="uni-group">
				<view class="search">
					<input class="uni-search" type="text" v-model="search.query" @confirm="searchFn" @input="e => search.iconShow = e.detail.value ? true : false" />
					<uni-icons type="close" size="20" v-if="search.iconShow" @click="clearSearch" class="search-icon"/>
				</view>
				<button class="uni-button hide-on-phone" type="default" size="mini" @click="searchFn">{{$t('common.button.search')}}</button>
				<button class="uni-button" type="primary" size="mini" @click="navigateTo('')">{{$t('common.button.add')}}</button>
				<button class="uni-button" type="warn" size="mini" :disabled="!notice.selectedIndexs.length" @click="delTable">{{$t('common.button.batchDelete')}}</button>
				<!-- #ifdef H5 -->
				<download-excel class="hide-on-phone" :fields="notice.exportExcel.fields" :data="notice.exportExcelData"
					:type="notice.exportExcel.type" :name="notice.exportExcel.filename">
					<button class="uni-button" type="primary" size="mini">{{$t('common.button.exportExcel')}}</button>
				</download-excel>
				<!-- #endif -->
			</view>
		</view>
		<view class="uni-container">
			<unicloud-db
				ref="udb"
				v-slot:default="{data, pagination, loading, hasMore, error, options}"
				collection="webnotice"
				field="_id,title,type,start,end"
				:getcount="true"
				:options="options"
				:page-size="options.pageSize"
				:page-current="options.pageCurrent"
				:where="search.where"
				page-data="replace"
				loadtime="manual"
				@load="onqueryload"
			>
			  <uni-table ref="table" :loading="loading" :emptyText="error.message || $t('common.empty')" stripe type="selection" @selection-change="selectionChange">
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
						<uni-td align="center">{{item.type ? '放假通知' : '普通通知'}}</uni-td>
						<uni-td align="center">{{item.start}}</uni-td>
						<uni-td align="center">{{item.end}}</uni-td>
						<uni-td align="center">
							<view class="uni-group">
								<button @click="navigateTo(item._id)" class="uni-button" size="mini"
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

<script setup>
import {reactive, ref, nextTick} from 'vue';
import { onReady, onShow, onUnload } from '@dcloudio/uni-app'
const table = ref();
const udb = ref();
const notice = reactive({
	selectedIndexs: [],
	exportExcelData: [],
	exportExcel: {
		filename: "uni-web-notice.xls",
		type: "xls",
		fields: {
			"唯一ID": "_id",
			"标题": "title",
			"开始时间": "start",
			"结束时间": "end",
		}
	},
})
const loadMore = reactive({
	contentdown: '',
	contentrefresh: '',
	contentnomore: '',
})
const options = reactive({
	pageSize: 20,
	pageCurrent: 1,
	filterData: {},
})
const search = reactive({
	query: '',
	where: '',
	iconShow: false,
})

function loadData(clear = true) {
	udb.value.loadData({ clear })
}
// 搜索
function searchFn() {
	const query = search.query.trim();
	const queryRe = new RegExp(query, 'i');
	// 支持模糊搜索的字段列表 => /范德萨/i.test(title)
	search.where = ['title', 'content'].map(name => queryRe + '.test(' + name + ')').join(' || ');
	nextTick(() => loadData())
}
function clearSearch(){
	search.query = "";
	search.iconShow = false;
	searchFn();
}
// 加载完成后将数据保存给excel导出
function onqueryload(data){
	notice.exportExcelData = data
}
onReady(() => loadData(false))
onShow(() => uni.$on('noticeRefresh', () => nextTick(() => loadData())));
onUnload(() => uni.$off('noticeRefresh'));
// 换页
const onPageChanged = () => {
	notice.selectedIndexs.length = 0
	table.value.clearSelection()
	udb.value.loadData({
		current: e.current
	})
}
// 每页数量
function changeSize(pageSize) {
	options.pageSize = pageSize;
	options.pageCurrent = 1;
	nextTick(() => { loadData() })
}

// 多选处理
function selectedItems() {
	const dataList = udb.value.dataList;
	return notice.selectedIndexs.map(i => dataList[i]._id)
}
// 批量删除
function delTable() {
	udb.value.remove(selectedItems(), {
		success(res) {
			table.value.clearSelection()
		}
	})
}
// 多选
function selectionChange(e) {
	notice.selectedIndexs = e.detail.index;
}
function navigateTo(id = ''){
	uni.navigateTo({
		url: id ? `/pages/webnotice/add?id=${id}` : '/pages/webnotice/add'
	})
}
function confirmDelete(id) {
	udb.value.remove(id, {
		success(res) {
			table.value.clearSelection()
		}
	})
}
</script>

<style>
	.search{
		display: inline-flex;
		position: relative;
	}
	.search-icon{
		position: absolute;
		z-index: 10;
		right: 40rpx;
		cursor: pointer;
		top: 50%;
		transform: translateY(-50%);
	}
</style>