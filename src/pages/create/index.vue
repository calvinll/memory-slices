<template>
  <view class="page">
    <view class="guide">
      <text class="guide-title">新建一条记忆</text>
      <text class="guide-sub">先选一张图，再写一句话，最后选个心情。</text>
    </view>
    <view class="section">
      <text class="label">图片</text>
      <view class="image-row">
        <view v-if="imagePath" class="preview-wrap" @click="previewImage">
          <image class="preview" :src="imagePath" mode="aspectFill" />
        </view>
        <text v-if="imagePath" class="path-hint">已选择</text>
        <view v-else class="placeholder">
          <text class="placeholder-text">未选择</text>
        </view>
        <u-button type="primary" size="small" @click="pickImage">拍照/选图</u-button>
      </view>
    </view>

    <view class="section">
      <text class="label">写点什么</text>
      <textarea
        class="native-textarea"
        :value="text"
        placeholder="写下一段今天的记忆…"
        maxlength="300"
        auto-height
        @input="onTextInput"
      />
      <view class="counter">
        <text class="counter-text">{{ text.length }}/300</text>
      </view>
    </view>

    <view class="section">
      <text class="label">心情</text>
      <view class="moods">
        <view class="mood-chip" :class="{ active: mood === 'happy' }" @click="mood = 'happy'">
          <text>开心</text>
        </view>
        <view class="mood-chip" :class="{ active: mood === 'sad' }" @click="mood = 'sad'">
          <text>难过</text>
        </view>
        <view class="mood-chip" :class="{ active: mood === 'calm' }" @click="mood = 'calm'">
          <text>平静</text>
        </view>
      </view>
    </view>

    <view class="actions">
      <button class="primary-btn" :disabled="!canSubmit" @click="submit">保存</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMemoryStore } from '@/stores/memory'
import type { Mood } from '@/types/memory'

const store = useMemoryStore()

const imagePath = ref<string>('')
const text = ref('')
const mood = ref<Mood>('calm')

const canSubmit = computed(() => text.value.trim().length > 0)

function onTextInput(e: any) {
  text.value = String(e?.detail?.value ?? '')
}

function pickImage() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const file = res.tempFiles?.[0]
      if (!file) return

      const path = file.path
      if (path) imagePath.value = path
    },
    fail: (err) => {
      uni.showToast({
        title: typeof err?.errMsg === 'string' ? err.errMsg : '选择图片失败',
        icon: 'none',
      })
    },
  })
}

function previewImage() {
  if (!imagePath.value) return
  uni.previewImage({ urls: [imagePath.value] })
}

function submit() {
  if (!canSubmit.value) return

  store.load()
  store.addCard({
    imagePath: imagePath.value || undefined,
    text: text.value.trim(),
    mood: mood.value,
  })

  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.page {
  padding: 24rpx;
}

.guide {
  padding: 18rpx 20rpx;
  border-radius: 16rpx;
  background: rgba(60, 156, 255, 0.08);
  border: 2rpx solid rgba(60, 156, 255, 0.18);
  margin-bottom: 24rpx;
}

.guide-title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: #0b3b8a;
  margin-bottom: 6rpx;
}

.guide-sub {
  display: block;
  font-size: 26rpx;
  color: rgba(11, 59, 138, 0.75);
}

.section {
  margin-bottom: 24rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #111;
  margin-bottom: 12rpx;
}

.image-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.preview-wrap,
.placeholder {
  width: 160rpx;
  height: 160rpx;
  border-radius: 16rpx;
  overflow: hidden;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview {
  width: 160rpx;
  height: 160rpx;
}

.path-hint {
  flex: 1;
  color: #16a34a;
  font-size: 24rpx;
}

.native-textarea {
  width: 100%;
  min-height: 240rpx;
  padding: 18rpx;
  border-radius: 16rpx;
  background: #fff;
  border: 2rpx solid rgba(0, 0, 0, 0.08);
  font-size: 28rpx;
  line-height: 40rpx;
  box-sizing: border-box;
}

.moods {
  display: flex;
  gap: 16rpx;
}

.mood-chip {
  padding: 16rpx 22rpx;
  border-radius: 999rpx;
  background: #fff;
  border: 2rpx solid rgba(0, 0, 0, 0.08);
  color: #111;
  font-size: 28rpx;
}

.mood-chip.active {
  border-color: #3c9cff;
  background: rgba(60, 156, 255, 0.12);
  color: #0b3b8a;
}

.primary-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 16rpx;
  background: #3c9cff;
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
}

.primary-btn[disabled] {
  background: #c8c9cc;
  color: rgba(255, 255, 255, 0.9);
}

.placeholder-text {
  color: #999;
  font-size: 24rpx;
}

.counter {
  margin-top: 8rpx;
  text-align: right;
}

.counter-text {
  font-size: 24rpx;
  color: #999;
}

.actions {
  margin-top: 40rpx;
}
</style>
