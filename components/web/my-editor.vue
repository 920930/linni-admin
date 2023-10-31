<template>
	<view class="tools">
		<uni-icons @click="jiacuBtn" custom-prefix="iconfont" type="icon-zitijiacu" size="20" class="cursor" />
		<uni-icons @click="xietiBtn" custom-prefix="iconfont" type="icon-zitixieti" size="20" class="cursor" />
		<uni-icons @click="bigFontBtn" custom-prefix="iconfont" type="icon-formatheader1" size="20" class="cursor" />
		<uni-icons @click="leftBtn" custom-prefix="iconfont" type="icon-zuoduiqi" size="20" class="cursor" />
		<uni-icons @click="centerBtn" custom-prefix="iconfont" type="icon-juzhongduiqi" size="20" class="cursor" />
		<uni-icons @click="rightBtn" custom-prefix="iconfont" type="icon-youduiqi" size="20" class="cursor" />
		<uni-icons @click="colorBtn" custom-prefix="iconfont" type="icon-text-color" size="20" class="cursor" />
		<uni-icons @click="bgColorBtn" custom-prefix="iconfont" type="icon-fontbgcolor" size="20" class="cursor" />
		<uni-icons @click="underlineBtn" custom-prefix="iconfont" type="icon-zitixiahuaxian" size="20" class="cursor" />
		<uni-icons @click="lineThroughBtn" custom-prefix="iconfont" type="icon-zitishanchuxian" size="20" class="cursor" />
		<uni-icons @click="dividerBtn" custom-prefix="iconfont" type="icon-fengexian" size="20" class="cursor" />
		<uni-icons @click="insertImage" custom-prefix="iconfont" type="icon-charutupian" size="20" class="cursor" />
	</view>
	<editor
		id="editor"
		class="ql-container"
		@ready="onEditorReady"
		placeholder="开始输入..."
		:show-img-size="true"
		:show-img-toolbar="true"
		:show-img-resize="true"
		@input="editorFn"
	/>
</template>

<script lang='ts' setup>
import { ref } from 'vue';
const props = defineProps(['modelValue'])
const emits = defineEmits(['update:modelValue'])
const editorCtx = ref();
const files = ref([]);

const onEditorReady = () => {
	// #ifdef APP-PLUS || H5 ||MP-WEIXIN
	uni.createSelectorQuery().select('#editor').context((res) => {
		editorCtx.value = res.context;
		editorCtx.value.setContents({
			html: props.modelValue
		})
	}).exec();
	// #endif
}
const editorFn = (e) => {
	emits('update:modelValue', e.detail.html)
}
const jiacuBtn = () => editorCtx.value.format('bold');
const xietiBtn = () => editorCtx.value.format('fontStyle', 'italic');
const bigFontBtn = () => editorCtx.value.format('header', 'h2');
const colorBtn = () => editorCtx.value.format('color', 'white');
const bgColorBtn = () => editorCtx.value.format('backgroundColor', 'red');
const leftBtn = () => editorCtx.value.format('align', 'left');
const centerBtn = () => editorCtx.value.format('align', 'center');
const rightBtn = () => editorCtx.value.format('align', 'right');
const underlineBtn = () => editorCtx.value.format('textDecoration', 'underline');
const lineThroughBtn = () => editorCtx.value.format('textDecoration', 'line-through');
const dividerBtn = () => editorCtx.value.insertDivider();
const insertImage = () => {
	uni.chooseImage({
		count: 2, //默认9
		sizeType: ['compressed'],
		sourceType: ['album'],
		success(res) {
			Array.isArray(res.tempFiles) ? files.value.push(...res.tempFiles) : files.value.push(res.tempFiles);
			if(Array.isArray(res.tempFilePaths)){
				res.tempFilePaths.forEach(item => {
					editorCtx.value.insertImage({
						src: item,
					})
				})
			}else{
				files.value.push(res.tempFilePaths)
				editorCtx.value.insertImage({
					src: res.tempFilePaths,
				})
			}
			
		}
	});
}

const updateImgSrc = async () => {
	let imgs = props.modelValue.matchAll(/src="(blob:[^">]+)"/g);
	imgs = [...imgs].map(item => item[1]);
	if(!imgs.length) return;
	// 将找到的file放进集合，按顺序上传，按顺序替换。
	let arrFiles = [];
	for (let img of imgs) {
		let arrFile = files.value.find(item => `${item.path}` === img);
		arrFile && arrFiles.push(arrFile)
	}
	const arr = arrFiles.map(item => {
		return uniCloud.uploadFile({
			filePath: item.path,
			cloudPath: item.name
		})
	})
	try{
		uni.showLoading({
			mask: true
		})
		const filesFormServer = await Promise.all(arr);
		let value = props.modelValue;
		let i = 0;
		// const regix = /<img[^>]+src="([^">]+)"/;
		const regix = /src="(blob:[^">]+)"/;
		while(regix.test(value) && i < filesFormServer.length){
			value = value.replace(regix, `src="${filesFormServer[i].fileID}"`)
			i+=1;
		}
		emits('update:modelValue', value)
		editorCtx.value.setContents({
			html: props.modelValue
		})
		uni.hideLoading()
	}catch(e){
		uni.showToast({
			title: e.message,
		})
	}
	files.value.length = 0;
}

defineExpose({updateImgSrc})
</script>

<style lang="scss" scoped>
	::v-deep .ql-editor::before {
		font-style: normal;
	}
	#editor {
		width: 100%;
		height: 400px;
		border: 1rpx solid rgba(0, 0, 0, 0.1);
		border-bottom-left-radius: 10rpx;
		border-bottom-right-radius: 10rpx;
		padding: 20rpx;
	}
	.tools{
		display: flex;
		gap: 40rpx;
		background-color: rgba(0, 0, 0, 0.1);
		padding: 20rpx;
	}
	.cursor{
		cursor: pointer;
	}
</style>