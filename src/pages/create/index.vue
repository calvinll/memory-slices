<template>
  <view class="page">
    <view class="guide">
      <text class="guide-title">新建记忆</text>
      <text class="guide-sub">像翻开相册一样，留白给今天。</text>
    </view>
    <view class="section">
      <text class="label">照片</text>
      <view class="image-row">
        <view v-if="imagePath" class="preview-wrap" @click="previewImage">
          <image class="preview" :src="imagePath" mode="aspectFill" />
        </view>
        <view v-else class="placeholder" @click="pickImage">
          <text class="placeholder-text">还没有照片</text>
        </view>
        <button class="icon-btn" @click="pickImage" aria-label="选择照片">
          <svg class="camera" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.2 7.2L9.6 5.6H14.4L15.8 7.2H18.2C19.2 7.2 20 8 20 9V18.2C20 19.2 19.2 20 18.2 20H5.8C4.8 20 4 19.2 4 18.2V9C4 8 4.8 7.2 5.8 7.2H8.2Z" stroke="#A69076" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M12 16.2C13.6569 16.2 15 14.8569 15 13.2C15 11.5431 13.6569 10.2 12 10.2C10.3431 10.2 9 11.5431 9 13.2C9 14.8569 10.3431 16.2 12 16.2Z" stroke="#A69076" stroke-width="1.5"/>
          </svg>
        </button>
      </view>
      <text class="hint">轻触相册或相机图标选择一张照片</text>
    </view>

    <view class="section">
      <text class="label">文字</text>
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
          <text>🌸 开心</text>
        </view>
        <view class="mood-chip" :class="{ active: mood === 'sad' }" @click="mood = 'sad'">
          <text>🌧️ 难过</text>
        </view>
        <view class="mood-chip" :class="{ active: mood === 'calm' }" @click="mood = 'calm'">
          <text>🍵 平静</text>
        </view>
        <view class="mood-chip" :class="{ active: mood === 'melancholy' }" @click="mood = 'melancholy'">
          <text>🍂 忧伤</text>
        </view>
        <view class="mood-chip" :class="{ active: mood === 'angry' }" @click="mood = 'angry'">
          <text>🔥 生气</text>
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
  padding: 40rpx 24rpx 24rpx;
}

.guide {
  padding: 18rpx 0;
  margin-bottom: 24rpx;
}

.guide-title {
  display: block;
  font-size: 36rpx;
  font-weight: 500;
  color: #4a4a48;
  letter-spacing: 0.5px;
}

.guide-sub {
  display: block;
  font-size: 24rpx;
  color: #9e9b94;
  margin-top: 8rpx;
}

.section {
  margin-bottom: 26rpx;
  padding: 16rpx;
  border-radius: 16rpx;
  background: #fdfcf8;
  border: 1px solid rgba(166, 144, 118, 0.15);
  box-shadow: 0 2px 8px rgba(161, 152, 135, 0.1);
}

.label {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  color: #4a4a48;
  margin-bottom: 12rpx;
}

.hint {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #9e9b94;
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
  background: #f0ece3;
  border: 1px solid rgba(166, 144, 118, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview {
  width: 160rpx;
  height: 160rpx;
  border-radius: 8rpx;
}

.icon-btn {
  width: 72rpx;
  height: 72rpx;
  border-radius: 999rpx;
  background: #f0ece3;
  border: 1px solid #a69076;
  display: flex;
  align-items: center;
  justify-content: center;
}

.camera {
  width: 34rpx;
  height: 34rpx;
}

.path-hint {
  flex: 1;
  color: #8fa895;
  font-size: 24rpx;
}

.native-textarea {
  width: 100%;
  min-height: 220rpx;
  padding: 12rpx 0;
  background: transparent;
  border: none;
  border-bottom: 2rpx solid #d4c4a8;
  font-size: 28rpx;
  line-height: 44rpx;
  color: #4a4a48;
  box-sizing: border-box;
}

.moods {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.mood-chip {
  padding: 14rpx 18rpx;
  border-radius: 40rpx;
  background: transparent;
  border: 1px solid rgba(166, 144, 118, 0.35);
  color: #4a4a48;
  font-size: 26rpx;
}

.mood-chip.active {
  background: #f0ece3;
  border: 1px solid #a69076;
}

.primary-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 40rpx;
  background: #a69076;
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
}

.primary-btn[disabled] {
  opacity: 0.55;
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
  color: #9e9b94;
}

.actions {
  margin-top: 40rpx;
}
</style>
