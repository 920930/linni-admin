<template>
	<uni-popup ref="popup" background-color="#fff">
		<view class="content">
			<view class="content-input">
				<text>月台编号</text>
				<uni-number-box v-model="info.value" style="margin: 10rpx 0 25rpx;" />
				<!-- <input type="number" v-model="info.value" placeholder="请输入月台编号" class="content-input"> -->
			</view>
			<view class="content-input">
				<text>月台状态</text>
				<uni-data-checkbox v-model="info.state" :localdata="range" />
			</view>
			<view>
				<button type="primary" size="mini" @tap="pushDoor">确定</button>
				<button type="warn" size="mini" style="margin-left: 20rpx;" @tap="popup.close()">关闭</button>
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
	import { ref, reactive, watch } from 'vue';
	const props = defineProps({
		id: Number,
		value: Number,
		state: Number
	})
	const emits = defineEmits(['pushDoor'])
	const info = reactive({
		id: props.id,
		value: props.value,
		state: props.state
	});
	watch(props, newInfo => {
		info.id = newInfo.id;
		info.value = newInfo.value;
		info.state = newInfo.state;
	})
	const popup = ref();
	const range = [{"value": 1,"text": "显示"}, {"value": 0,"text": "关闭"	}];
	
	const pushDoor = () => {
		emits('pushDoor', {...info});
		popup.value.close();
	}
	
	defineExpose({popup});
</script>

<style scoped lang="scss">
	.content{
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		&-input{
			font-size: 14px;
			color: #666;
			width: 1000rpx;
			@media screen and (max-width: 800px) {
				width: 600rpx;
			}
		}
	}
</style>