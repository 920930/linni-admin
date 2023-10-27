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
	/>
</template>

<script lang='ts' setup>
import { ref } from 'vue';

const editorCtx = ref()
const onEditorReady = () => {
	// #ifdef APP-PLUS || H5 ||MP-WEIXIN
	uni.createSelectorQuery().select('#editor').context((res) => {
		editorCtx.value = res.context;
	}).exec();
	// #endif
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
			console.log(res.tempFiles)
			if(Array.isArray(res.tempFilePaths)){
				res.tempFilePaths.forEach(item => {
					editorCtx.value.insertImage({
						src: item
					})
				})
			}else{
				editorCtx.value.insertImage({
					src: res.tempFilePaths
				})
			}
			
		}
	});
	// editorCtx.value.insertImage({
	// 	success(e){
	// 		console.log(e)
	// 	}
	// })
}
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