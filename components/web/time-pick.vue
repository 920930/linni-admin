<template>
	<uni-popup ref="popup" background-color="#fff">
		<view class="content">
			<text>开始时间段</text>
			<picker mode="time" :value="time.start" @change="startChange">
				<view class="content-item">时间选择：{{time.start}}</view>
			</picker>
			<text>结束时间段</text>
			<picker mode="time" :value="time.end" :start="time.start" @change="endChange">
				<view class="content-item">时间选择：{{time.end}}</view>
			</picker>
			<text>本时段开放入场车辆数量</text>
			<uni-number-box v-model="time.num" style="margin: 10rpx 0 25rpx;" />
			<button type="primary" size="mini" @tap="pushTime">保存</button>
			<button type="warn" size="mini" @tap="popup.close()" style="margin-left: 20rpx;">关闭</button>
		</view>
	</uni-popup>
</template>

<script setup>
	import { reactive, ref, computed, watch } from 'vue';
	const props = defineProps({
		id: Number,
		start: String,
		end: String,
		num: Number,
		order: Number,
	})
	const emits = defineEmits(['pushTime']);
	const popup = ref();
	const time = reactive({
		id: props.id,
		start: props.start,
		end: props.end,
		num: props.num,
		order: props.order,
	})
	watch(props, ret => {
		time.id = ret.id;
		time.start = ret.start;
		time.end = ret.end;
		time.num = ret.num;
		time.order = ret.order;
	})
	
	const startChange = e => time.start = e.detail.value;
	const endChange = e => time.end = e.detail.value;
	const nowFn = () => Date.now();
	const pushTime = () => {
		if(time.start == time.end || (time.start.slice(0, 2) - 0) > time.end.slice(0, 2) - 0) {
			return uni.showToast({
				title: "请调整开始和结束时间",
				icon: "none",
				duration: 3000
			})
		}
		time.order = time.start.slice(0, 2) - 0;
		emits('pushTime', time);
		popup.value.close();
	}
	defineExpose({popup});
</script>

<style scoped lang="scss">
.content{
	padding: 30rpx;
	&-item{
		width: 1000rpx;
		margin: 10rpx 0 25rpx;
		border: 1rpx solid rgba(0, 0, 0, 0.1);
		color: $uni-text-color-placeholder;
		padding: 15rpx 20rpx;
		font-size: 14px;
		@media screen and (max-width: 800px) {
			width: 600rpx;
		}
	}
}
</style>