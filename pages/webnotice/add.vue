<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validate-trigger="submit" err-show-type="toast">
      <uni-forms-item name="title" label="通知标题" required>
        <uni-easyinput v-model="formData.title" />
      </uni-forms-item>
      <uni-forms-item name="type" label="通知类型">
        <uni-data-checkbox v-model="formData.type" :localdata="type_localdata"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="start" label="开始时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData.start"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="end" label="结束时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData.end"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="content" label="通知正文" required>
				<MyEditor ref="editorRef" v-model="formData.content" />
        <!-- <uni-easyinput placeholder="通知正文内容" v-model="formData.content"></uni-easyinput> -->
      </uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" @click="submit">提交</button>
      </view>
    </uni-forms>
		
  </view>
</template>

<script setup>
	import { reactive, ref } from 'vue';
	import { onReady } from '@dcloudio/uni-app';
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
	const type_localdata = [{"value": 0, "text": '普通通知'}, {"value": 1, "text": '放假通知'}];
	const form = ref();
	const editorRef = ref();
	const formData = reactive({
	  title: "",
	  type: null,
	  start: null,
	  end: null,
	  content: "fdsfdsfds<p>fdsfgdshgfdghf</p>"
	})
	const rules = ref({...getValidator(Object.keys(formData))});
	onReady(() => {
	  form.value.setRules(rules.value)
	})
	
	const submit = async () => {
		await editorRef.value.updateImgSrc();
		
		uni.showLoading({
			mask: true
		})
		form.value.validate().then(res => {
			// 先通过myeditor 暴露的 updateImgSrc上传图片，并更新图片链接后再上传
			
			console.log(res)
			// return this.submitForm(res)
		}).catch(() => {
		}).finally(() => {
			uni.hideLoading()
		})
	}
	
	
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
  }

  .uni-button {
    width: 184px;
  }
</style>
