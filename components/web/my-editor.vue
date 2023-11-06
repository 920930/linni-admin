<template>
	<view class="tools">
		<uni-icons @click="formatBtn('bold', 'bold')" custom-prefix="iconfont" type="icon-zitijiacu" size="20" class="cursor" />
		<uni-icons @click="formatBtn('fontStyle', 'italic')" custom-prefix="iconfont" type="icon-zitixieti" size="20" class="cursor" />
		<uni-icons @click="formatBtn('header', 'h2')" custom-prefix="iconfont" type="icon-formatheader1" size="20" class="cursor" />
		<uni-icons @click="formatBtn('align', 'left')" custom-prefix="iconfont" type="icon-zuoduiqi" size="20" class="cursor" />
		<uni-icons @click="formatBtn('align', 'center')" custom-prefix="iconfont" type="icon-juzhongduiqi" size="20" class="cursor" />
		<uni-icons @click="formatBtn('align', 'right')" custom-prefix="iconfont" type="icon-youduiqi" size="20" class="cursor" />
		<uni-icons @click="formatBtn('color', 'white')" custom-prefix="iconfont" type="icon-text-color" size="20" class="cursor" />
		<uni-icons @click="formatBtn('textDecoration', 'underline')" custom-prefix="iconfont" type="icon-fontbgcolor" size="20" class="cursor" />
		<uni-icons @click="formatBtn('textDecoration', 'underline')" custom-prefix="iconfont" type="icon-zitixiahuaxian" size="20" class="cursor" />
		<uni-icons @click="formatBtn('textDecoration', 'line-through')" custom-prefix="iconfont" type="icon-zitishanchuxian" size="20" class="cursor" />
		<uni-icons @click="dividerBtn" custom-prefix="iconfont" type="icon-fengexian" size="20" class="cursor" />
		<uni-icons @click="insertImage" custom-prefix="iconfont" type="icon-charutupian" size="20" class="cursor" />
	</view>
	<editor
		id="editor"
		class="ql-container"
		placeholder="开始输入..."
		:show-img-size="true"
		:show-img-toolbar="true"
		:show-img-resize="true"
		@ready="onEditorReady"
		@blur="e => blurFn(e.detail.html)"
	/>
	<!-- <canvas canvas-id="myCanvas" type="2d" :style="`width: ${canvasStyle.width}px; height: ${canvasStyle.height}px`" /> -->
</template>

<script lang='ts' setup>
import { ref, watch } from 'vue';
// #ifdef H5
import { tinyCanvas } from "./tinyCanvas.js";
// #endif
const props = defineProps(['modelValue'])
const emits = defineEmits(['update:modelValue'])
const editorCtx = ref();
const files = ref([]);

// #ifdef APP-PLUS || H5 ||MP-WEIXIN
watch(() => props.modelValue, async (newValue) => {
	const oldValue = await getContent()
	if(newValue!==oldValue){
		editorCtx.value.setContents({
			html: newValue
		})
	}
})
// #endif
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
const blurFn = (html: string) => emits('update:modelValue', html);
const formatBtn = (key: string, val: string) => editorCtx.value.format(key, val);
const dividerBtn = () => editorCtx.value.insertDivider();

const getContent = async (): Promise<string> => {
	return new Promise((resolve) => {
		editorCtx.value.getContents({
			success({html}){
				resolve(html)
			}
		});
	})
}
// const canvasStyle = reactive({
// 	width: 750,
// 	height: 1060
// })
const updateValue = async () => {
	let valueData = props.modelValue;
	const imgMatch = valueData.matchAll(/src="(blob:[^">]+)"/g);
	const imgs = [...imgMatch].map(item => item[1]);
	if(!imgs.length){
		return valueData;
	};
	// 将找到的file放进集合，按顺序上传，按顺序替换。
	let arrFiles = [];
	for (let img of imgs) {
		let arrFile = files.value.find(item => `${item.path}` === img);
		arrFile && arrFiles.push(arrFile)
	}
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	
	const arr = arrFiles.map(async (item) => {
		let path = item.path;
		// #ifdef H5
		path = await tinyCanvas(item);
		// #endif
		return uniCloud.uploadFile({
			filePath: path,
			cloudPath: item.name
		})
	});

	try{
		uni.showLoading({
			mask: true
		})
		const filesFormServer = await Promise.all(arr);
		let i = 0;
		// const regix = /<img[^>]+src="([^">]+)"/;
		const regix = /src="(blob:[^">]+)"/;
		while(regix.test(valueData) && i < filesFormServer.length){
			valueData = valueData.replace(regix, `src="${filesFormServer[i].fileID}"`)
			i+=1;
		}
		// #ifdef APP-PLUS || H5 ||MP-WEIXIN
		// emits('update:modelValue', value)
		editorCtx.value.setContents({
			html: valueData
		})
		// #endif
	}catch(e){
		uni.showToast({
			title: e.message,
		})
	}finally{
		uni.hideLoading()
	}
	files.value.length = 0;
	// emits('update:modelValue', valueData)
	return valueData;
}

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

defineExpose({updateValue})
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