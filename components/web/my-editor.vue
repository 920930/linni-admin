<template>
	<view class="tools">
		<uni-icons custom-prefix="iconfont" type="icon-zitijiacu" size="20" />
		<uni-icons custom-prefix="iconfont" type="icon-zitixieti" size="20" />
		<uni-icons custom-prefix="iconfont" type="icon-formatheader1" size="20" />
		<uni-icons custom-prefix="iconfont" type="icon-zuoduiqi" size="20" />
		<uni-icons custom-prefix="iconfont" type="icon-juzhongduiqi" size="20" />
		<uni-icons custom-prefix="iconfont" type="icon-youduiqi" size="20" />
		<uni-icons custom-prefix="iconfont" type="icon-text-color" size="20" />
		<uni-icons custom-prefix="iconfont" type="icon-fontbgcolor" size="20" />
		<uni-icons custom-prefix="iconfont" type="icon-zitixiahuaxian" size="20" />
		<uni-icons custom-prefix="iconfont" type="icon-zitishanchuxian" size="20" />
		<uni-icons custom-prefix="iconfont" type="icon-fengexian" size="20" />
		<uni-icons custom-prefix="iconfont" type="icon-charutupian" size="20" />
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
import { ref } from 'vue'
const onEditorReady = () => {
	// #ifdef APP-PLUS || H5 ||MP-WEIXIN
	uni.createSelectorQuery().select('#editor').context(({context}) => {
		console.log(context)
		// this.editorCtx = res.context
	}).exec()
	// #endif
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
</style>