<template>
	<view v-if="site" class="site">
		<view class="site-title site-border">{{site.title}}</view>
		<view class="site-border">{{site.ftitle}}</view>
		<view class="site-border">{{site.mobile}}</view>
		<view class="site-border">
			<text>车型</text>
			<view class="site-flex" style="margin-top: 20rpx;">
				<uni-tag :text="item" inverted v-for="item in site.genre" :key="item" />
			</view>
		</view>
		<view class="site-border">
			<text>可预约时间</text>
			<view class="site-flex" style="margin-top: 20rpx;">
				<uni-tag :text="`时间: ${item.start} - ${item.end} 车辆量: ${item.num}`" inverted v-for="item in site.times" :key="item.id" />
			</view>
		</view>
		<view class="site-border">
			<text>月台编号</text>
			<view class="site-flex" style="margin-top: 20rpx;">
				<uni-tag :text="`${door.value}号月台 状态: ${door.state ? '正常' : '关闭'}`" inverted v-for="door in site.doors" :key="door.id" />
			</view>
		</view>
		<view class="uni-button-group">
			<button type="primary" class="uni-button" @click="edit">编辑</button>
			<button type="warn" class="uni-button" @click="submit">返回</button>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onLoad } from "@dcloudio/uni-app"
	const db = uniCloud.importObject('website');
	const site = ref();
	const getOne = async (id) => {
		try{
			const { data } = await db.show(id);
			site.value = data;
			console.log(data)
		}catch(e){
			uni.showToast({
				title: '异常'
			})
		}
	}
	
	onLoad(e => {
		if(e.id) getOne(e.id)
	})
	const submit = () => {
		uni.navigateTo({
			url: `/pages/website/list`
		})
	}
	const edit = () => {
		uni.navigateTo({
			url: `/pages/website/edit?id=${site.value._id}`
		})
	}
</script>

<style lang="scss" scoped>
	.site{
		padding: 30rpx;
		&-border{
			border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
			margin-bottom: 20rpx;
			padding: 10rpx;
		}
		&-title{
			font-size: 40rpx;
		}
		&-flex{
			display: flex;
			flex-wrap: wrap;
			gap: 20rpx;
		}
	}
	.uni-button-group {
	  margin-top: 50px;
	  /* #ifndef APP-NVUE */
	  display: flex;
	  /* #endif */
	  justify-content: center;
		gap: 20rpx;
	}
	
	.uni-button {
	  width: 184px;
	}
</style>