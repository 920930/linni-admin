<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" label-position="top" validate-trigger="submit" err-show-type="toast">
			<uni-forms-item name="_id" label="公司简称" required v-show="false">
			  <uni-easyinput placeholder="公司名称" v-model="formData._id" trim="both" />
			</uni-forms-item>
      <uni-forms-item name="title" label="公司简称" required>
        <uni-easyinput placeholder="公司名称" v-model="formData.title" trim="both" />
      </uni-forms-item>
			<uni-forms-item name="ftitle" label="公司全称" required>
			  <uni-easyinput placeholder="公司名称" v-model="formData.ftitle" trim="both" />
			</uni-forms-item>
      <uni-forms-item name="mobile" label="公司电话" required>
        <uni-easyinput placeholder="公司电话" v-model="formData.mobile" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="genre" label="运货类型">
				<button type="primary" size="mini" @click="() => genreRef.open()">添加运货类型</button>
				<view style="display: flex; gap: 20rpx; flex-wrap: wrap; margin-top: 20rpx;">
					<uni-tag :text="item" inverted type="primary" v-for="item in formData.genre" :key="item" @click="delGenre(item)" />
				</view>
				<view v-model="formData.genre" />
      </uni-forms-item>
      <uni-forms-item name="times" label="开放时间">
				<button type="primary" size="mini" @tap="editTimeFn(0)" style="margin-bottom: 20rpx;">添加时间</button>
				<view class="timelist">
					<view class="timelist-item" v-for="item in formData.times" :key="item.startMins">
						<uni-tag :text="`时间: ${item.start} - ${item.end}`" inverted type="primary" />
						<uni-tag :text="`车辆量: ${item.num}`" inverted type="success" />
						<view class="timelist-item-r">
							<uni-icons type="compose" size="20" style="cursor: pointer;" @click="editTimeFn(item.startMins)" />
							<uni-icons type="trash" size="20" style="cursor: pointer;" @click="delTimeFn(item.startMins)" />
						</view>
					</view>
				</view>
				<view v-model="formData.times" />
      </uni-forms-item>
      <uni-forms-item name="day" label="未来预约" required>
        <uni-number-box v-model="formData.day" />
      </uni-forms-item>
      <uni-forms-item name="doors" label="月台仓门">
				<button type="primary" size="mini" @tap="editDoorFn(0)" style="margin-bottom: 20rpx;">添加月台仓门</button>
				<view class="timelist">
					<view class="timelist-item" v-for="door in formData.doors" :key="door.id">
						<uni-tag :text="`${door.value}号月台 状态: ${door.state ? '正常' : '关闭'}`" inverted :type="`${door.state ? 'success': 'error'}`" />
						<view class="timelist-item-r">
							<uni-icons type="compose" size="20" @click="editDoorFn(door.id)" style="cursor: pointer;" />
							<uni-icons type="trash" size="20" style="cursor: pointer;" @click="delDoorFn(door.id)" />
						</view>
					</view>
				</view>
				<view v-model="formData.doors" />
      </uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" @click="submit">提交</button>
      </view>
    </uni-forms>
		<TimePick ref="timepickRef" v-bind="editTime" @pushTime="pushTime" />
		<DoorPick ref="doorpickRef" v-bind="editDoor" @pushDoor="pushDoor"  />
		<uni-popup ref="genreRef" type="dialog">
			<uni-popup-dialog mode="input" message="成功消息" :duration="2000" :before-close="true" @confirm="genreConfirm" />
		</uni-popup>
  </view>
</template>

<script setup>
	import { reactive, ref } from 'vue';
	import { onReady, onLoad } from '@dcloudio/uni-app';
	import TimePick from '../../components/web/time-pick.vue';
	import DoorPick from '../../components/web/door-pick.vue';
	import { validator } from '../../js_sdk/validator/website.js';
	
	const db = uniCloud.importObject('website')
	const form = ref();
	const timepickRef = ref();
	const doorpickRef = ref();
	const genreRef = ref();
	
	const formData = reactive({
		_id: "",
		title: "",
		ftitle: "",
		mobile: "",
		day: 5,
		genre: [],
		times: [],
		doors: []
	});
	const editTime = reactive({
		startMins: 0,
		endMins: 0,
		start: '09:00',
		end: '10:00',
		num: 10,
	});
	const editDoor = reactive({
		id: 0,
		value: 1,
		state: 1
	})
	const editTimeFn = id => {
		if(id === 0){
			editTime.startMins = 0;
			editTime.endMins = 0;
			editTime.start = '09:00';
			editTime.end = '10:00';
			editTime.num = 10;
		} else {
			const one = formData.times.find(item => item.startMins === id);
			editTime.startMins = id;
			editTime.endMins = one.endMins;
			editTime.start = one.start;
			editTime.end = one.end;
			editTime.num = one.num;
		}
		timepickRef.value.popup.open();
	}
	const editDoorFn = id => {
		if(id === 0) {
			editDoor.id = Date.now();
		}else{
			const one = formData.doors.find(item => item.id == id);
			editDoor.id = one.id;
			editDoor.value = one.value;
			editDoor.state = one.state;
		}
		doorpickRef.value.popup.open();
	}
	const submit = async () => {
		// uni.showLoading({
		// 	title: '更改中...'
		// })
		try{
			const res = await form.value.validate();
			res._id ? db.update(res) : db.store(res);
		}catch(e){
			//TODO handle the exception
			console.log(e)
			return;
		}
		// uni.hideLoading();
		uni.navigateTo({
			url: '/pages/website/list'
		})
		// form.value.validate().then((res) => {
		// 	return res._id ? db.update(res) : db.store(res)
		// }).catch(() => {
		// }).finally(() => {
		// 	uni.hideLoading();
		// })
	}
	
	function getValidator(fields) {
	  let result = {}
	  for (let key in validator) {
	    if (fields.indexOf(key) > -1) {
	      result[key] = validator[key]
	    }
	  }
	  return result
	}
	const getSite = async (id) => {
		const { data } = await db.show(id);
		formData._id = data._id;
		formData.title = data.title;
		formData.ftitle = data.ftitle;
		formData.mobile = data.mobile;
		formData.genre = data.genre;
		formData.times = data.times;
		formData.doors = data.doors;
	}
	onLoad(e => {
		if(e.id !== '0') getSite(e.id)
		else formData._id = '0';
	})
	const rules = ref({...getValidator(Object.keys(formData))});
	onReady(() => {
		form.value.setRules(rules.value);
	})
	
	const pushTime = e => {
		// const timeOne = formData.times.find(item => {
		// 	return (item.startMins <= e.startMins && item.endMins => e.endMins)
		// 		|| ()
		// })
		// 注意e.startMins 可能为 0，后面修正
		const one = formData.times.find(item => item.start === e.start);
		// 新增
		if(e.startMins === 0) {
			if(one) {
				return uni.showToast({
					title: "开始时间已存在",
					icon: "none",
					duration: 3000,
				})
			}
			const date = new Date();
			const arrStart = e.start.split(':');
			const arrEnd = e.end.split(':');
			const timeStart = date.setHours(arrStart[0]-0, arrStart[1]-0, 0);
			const timeEnd = date.setHours(arrEnd[0]-0, arrEnd[1]-0, 0);
			const dayStart = date.setHours(0, 0, 0);
			e.startMins = timeStart - dayStart;
			e.endMins = timeEnd - dayStart;
			formData.times.push({...e})
		}else{
			// 编辑
			const me = formData.times.find(item => item.startMins === e.startMins);
			if(one) {
				if(me.startMins !== one.startMins){
					return uni.showToast({
						title: "开始时间已存在",
						icon: "none",
						duration: 3000,
					})
				}
			}
			me.start = e.start;
			me.end = e.end;
			me.num = e.num;
			const date = new Date();
			const arrStart = e.start.split(':');
			const arrEnd = e.end.split(':');
			const timeStart = date.setHours(arrStart[0]-0, arrStart[1]-0, 0);
			const timeEnd = date.setHours(arrEnd[0]-0, arrEnd[1]-0, 0);
			const dayStart = date.setHours(0, 0, 0);
			me.startMins = timeStart - dayStart;
			me.endMins = timeEnd - dayStart;
		}
		formData.times.sort((a, b) => a.startMins - b.startMins);
	}
	const pushDoor = (e) => {
		const one = formData.doors.find(door => door.id === e.id);
		const two = formData.doors.find(door => door.value === e.value);
		// 编辑
		if(one){
			if(two && one.id != two.id){
				return uni.showToast({
					title: "仓门编号已存在",
					icon: "none"
				})
			}
			one.value = e.value;
			one.state = e.state;
		}else{
			// 新增
			if(two){
				return uni.showToast({
					title: "仓门编号已存在",
					icon: "none"
				})
			}
			formData.doors.push({...e})
		}
		formData.doors.sort((a, b) => a.value - b.value)
	}
	const genreConfirm = e => {
		const bool = formData.genre.includes(e);
		if(bool) {
			return uni.showToast({
				title: "已存在",
				icon: "none",
				duration: 3000,
			})
		}
		formData.genre.push(e);
		genreRef.value.close();
	}
	const delGenre = (key) => {
		uni.showModal({
			title: `确定要删除${key}吗？`,
			content: '删除后新增数据即可',
			success(res) {
				if(res.confirm){
					formData.genre = formData.genre.filter(item => item != key)
				}
			}
		})
	}
	const delTimeFn = (id) => {
		uni.showModal({
			title: '确认删除吗',
			success(e) {
				if(e.confirm) {
					formData.times = formData.times.filter(item => item.startMins !== id)
				}
			}
		})
	}
	const delDoorFn = (id) => {
		uni.showModal({
			title: '确认删除吗',
			success(e) {
				if(e.confirm) {
					formData.doors = formData.doors.filter(door => door.id !== id)
				}
			}
		})
	}
</script>

<style scoped lang="scss">
  .uni-container {
    padding: 15px;
  }

  .uni-input-border,
  .uni-textarea-border {
    width: 100%;
    font-size: 14px;
    color: #666;
    border: 1px #e5e5e5 solid;
    border-radius: 5px;
    box-sizing: border-box;
  }

  .uni-input-border {
    padding: 0 10px;
    height: 35px;

  }

  .uni-textarea-border {
    padding: 10px;
    height: 80px;
  }

  .uni-button-group {
    margin-top: 50px;
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    justify-content: center;
  }

  .uni-button {
    width: 184px;
  }
	
	.timelist{
		display: grid;
		gap: 20rpx 40rpx;
		grid-template-columns: repeat(2, 1fr);
		&-item{
			display: flex;
			gap: 15rpx;
			border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
			padding-bottom: 20rpx;
			&-r{
				flex: 1;
				display: flex;
				gap: 10rpx;
				justify-content: flex-end;
			}
		}
	}
</style>
