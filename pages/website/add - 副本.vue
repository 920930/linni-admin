<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validate-trigger="submit" err-show-type="toast">
      <uni-forms-item name="title" required>
        <uni-easyinput placeholder="公司名称" v-model="formData.title" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="mobile" required>
        <uni-easyinput placeholder="公司电话" v-model="formData.mobile" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="genre" label="">
        <uni-data-checkbox :multiple="true" v-model="formData.genre"></uni-data-checkbox>
      </uni-forms-item>
      <!-- <uni-forms-item name="time" label="">
        <uni-data-checkbox :multiple="true" v-model="formData.time"></uni-data-checkbox>
      </uni-forms-item> -->
      <uni-forms-item name="room" label="">
        <uni-data-checkbox :multiple="true" v-model="formData.room"></uni-data-checkbox>
      </uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" @click="submit">提交</button>
      </view>
    </uni-forms>
  </view>
</template>

<script setup>
	import { reactive, ref } from 'vue';
	import { onReady } from "@dcloudio/uni-app";
  // import { validator } from '../../js_sdk/validator/website.js';
	// import { timeFn } from "./data.js";

  // const db = uniCloud.database();
  // const dbCollectionName = 'website';

  function getValidator(fields) {
    let result = {}
    for (let key in validator) {
      if (fields.indexOf(key) > -1) {
        result[key] = validator[key]
      }
    }
    return result
  }
	
	const form = ref();
	const formData = reactive({
		title: "",
		mobile: "",
		genre: [],
		time: [],
		room: []
	});
	
	// const rules = ref({...getValidator(Object.keys(formData))})
  
	onReady() {
		// form.value.setRules(rules.value)
	}
	
	const submit = () => {
		uni.showLoading({
			mask: true
		})
		form.value.validate().then((res) => {
			return submitForm(res)
		}).catch(() => {
		}).finally(() => {
			uni.hideLoading()
		})
	}
		
	const submitForm = (value) => {
        // 使用 clientDB 提交数据
        // return db.collection(dbCollectionName).add(value).then((res) => {
        //   uni.showToast({
        //     icon: 'none',
        //     title: '新增成功'
        //   })
        //   // this.getOpenerEventChannel().emit('refreshData')
        //   setTimeout(() => uni.navigateBack(), 500)
        // }).catch((err) => {
        //   uni.showModal({
        //     content: err.message || '请求服务失败',
        //     showCancel: false
        //   })
        // })
      }
</script>

<style>
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
</style>
