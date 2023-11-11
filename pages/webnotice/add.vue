<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validate-trigger="submit" err-show-type="toast">
      <uni-forms-item name="title" label="通知标题" required>
        <uni-easyinput v-model="formData.title" />
      </uni-forms-item>
      <uni-forms-item name="type" label="通知类型">
        <uni-data-checkbox v-model="formData.type" :localdata="type_localdata"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="start" label="开始时间" style="display: flex; align-items: center;" v-if="formData.type">
				<picker mode="date" :value="numToTime(formData.start)" @change="e => pickerTime('start', e.detail.value)">
					<view style="border: 1rpx rgba(0, 0, 0, 0.1) solid; padding: 17rpx;">
						<uni-dateformat :date="numToTime(formData.start)" format="yyyy-MM-dd" />
					</view>
				</picker>
      </uni-forms-item>
      <uni-forms-item name="end" label="结束时间" style="display: flex; align-items: center;" v-if="formData.type">
				<picker mode="date" :value="numToTime(formData.end)" @change="e => pickerTime('end', e.detail.value)">
					<view style="border: 1rpx rgba(0, 0, 0, 0.1) solid; padding: 17rpx;">
						<uni-dateformat :date="numToTime(formData.end)" format="yyyy-MM-dd" />
					</view>
				</picker>
      </uni-forms-item>
      <uni-forms-item name="content" label="通知正文" required>
				<MyEditor ref="editorRef" v-model="formData.content" />
        <!-- <uni-easyinput placeholder="通知正文内容" v-model="formData.content"></uni-easyinput> -->
      </uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" @click="submit" :disabled="subool">提交</button>
        <button type="default" class="uni-button" @click="backFn">返回</button>
      </view>
    </uni-forms>
		
  </view>
</template>

<script setup>
	import { reactive, ref } from 'vue';
	import { onReady, onLoad } from '@dcloudio/uni-app';
	import { validator } from '../../js_sdk/validator/webnotice.js';
	import MyEditor from "../../components/web/my-editor.vue";
	
	function getValidator(fields) {
	  let result = {}
	  for (let key in validator) {
	    if (fields.indexOf(key) > -1) {
	      result[key] = validator[key]
	    }
	  }
	  return result
	}
	const db = uniCloud.importObject('webnotice');
	const type_localdata = [{"value": 0, "text": '普通通知'}, {"value": 1, "text": '放假通知'}];
	const form = ref();
	const editorRef = ref();
	const subool = ref(false);
	const formData = reactive({
		_id: '',
	  title: "",
	  type: 1,
	  start: initTime('start'),
	  end: initTime('end'),
	  content: ""
	})
	const rules = ref({...getValidator(Object.keys(formData))});
	
	onLoad(e => {
		if(e.id) {
			formData._id = e.id;
			getShow(e.id)
		}
	})
	onReady(() => {
	  form.value.setRules(rules.value)
	})
	function initTime(type, num = Date.now()){
		const time = new Date(num);
		type === 'start' ? time.setHours(0,0,0) : time.setHours(23,59,59,999);
		return time.getTime();
	}
	function numToTime(num) {
		const time = new Date(num);
		const year = time.getFullYear()
		const month = time.getMonth() + 1;
		const date = time.getDate();
		return `${year}-${month}-${date}`;
	}
	// 如果_id存在就获取数
	function getShow(id){
		db.show(id).then(({data}) => {
			formData._id = data._id;
			formData.title = data.title;
			formData.type = data.type;
			formData.start = data.start;
			formData.end = data.end;
			formData.content = data.content;
		})
	}
	
	const submit = async () => {
		uni.$emit('noticeRefresh');
		subool.value = true;
		form.value.validate().then(async (res) => {
			// 先通过myeditor 暴露的 updateValue上传图片，并更新图片链接后再上传
			res.content = await editorRef.value.updateValue();
			if(formData._id) {
				await db.edit(formData._id, res)
			}else{
				await db.store(res)
			}
			setTimeout(() => uni.navigateBack(), 500)
		}).catch(() => {
		}).finally(() => {
			subool.value = false;
		})
	}
	const pickerTime = (val, time) => formData[val] = initTime(val, time);
	const backFn = () => uni.navigateBack();
</script>

<style>
	::v-deep .uni-forms{
		max-width: 900px !important;
	}
	::v-deep .uni-forms-item__label {
		width: 90px !important;
	}
  .uni-container {
    padding: 15px;
  }

  .uni-input-border,
  .uni-textarea-border {
    width: 90%;
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
		gap: 40rpx;
  }

  .uni-button {
    width: 184px;
  }
</style>
