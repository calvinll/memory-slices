<template>
  <view class="page">
    <view class="header">
      <text class="title">记忆切片</text>
      <text class="subtitle">像写手账一样，留住今天</text>
    </view>

    <view v-if="cards.length === 0" class="empty">
      <view class="empty-illus" v-html="emptySvg" />
      <text class="empty-text">记录你的第一个瞬间</text>
      <text class="empty-sub">像写日记一样，留住今天</text>
      <button class="primary-btn" @click="goCreate">开始记录</button>
    </view>

    <view v-else class="grid">
      <view v-for="card in cards" :key="card.id" class="card" @click="openCard(card.id)">
        <image v-if="card.imagePath" class="card-image" :src="card.imagePath" mode="aspectFill" />
        <view class="card-body">
          <view class="card-meta">
            <text class="mood">{{ moodLabel(card.mood) }}</text>
            <text class="card-date">{{ formatDate(card.createdAt) }}</text>
          </view>
          <text class="card-text" :class="{ 'with-image': !!card.imagePath }">{{ card.text }}</text>
        </view>
      </view>
    </view>

    <button class="fab" @click="goCreate">＋</button>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useMemoryStore } from '@/stores/memory'
import type { Mood } from '@/types/memory'

const store = useMemoryStore()

onShow(() => {
  store.load()
})

const cards = computed(() => store.cards)

const emptySvg = `
<svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M28 26C28 21.6 31.6 18 36 18H78C83.5 18 88.7 20.3 92.5 24.3L118 50.8C121.5 54.5 123.5 59.3 123.5 64.4V94C123.5 98.4 119.9 102 115.5 102H36C31.6 102 28 98.4 28 94V26Z" stroke="#A69076" stroke-width="1.5"/>
  <path d="M78 18V42C78 46.4 81.6 50 86 50H123.5" stroke="#A69076" stroke-width="1.5"/>
  <path d="M44 66H92" stroke="#D4C4A8" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M44 78H104" stroke="#D4C4A8" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M44 90H84" stroke="#D4C4A8" stroke-width="1.5" stroke-linecap="round"/>
</svg>
`.trim()

function goCreate() {
  uni.navigateTo({ url: '/pages/create/index' })
}

function openCard(id: string) {
  uni.showToast({ title: `TODO 详情页：${id}`, icon: 'none' })
}

function moodLabel(mood: Mood) {
  if (mood === 'happy') return '🌸 开心'
  if (mood === 'sad') return '🌧️ 难过'
  if (mood === 'calm') return '🍵 平静'
  if (mood === 'melancholy') return '🍂 忧伤'
  return '🔥 生气'
}

function formatDate(ts: number) {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}
</script>

<style scoped lang="scss">
.page {
  padding: 24rpx;
}

.header {
  padding: 28rpx 0 18rpx;
}

.title {
  display: block;
  font-size: 36rpx;
  font-weight: 500;
  color: #4a4a48;
  letter-spacing: 0.5px;
}

.subtitle {
  display: block;
  font-size: 24rpx;
  color: #9e9b94;
  margin-top: 6rpx;
}

.empty {
  padding: 60rpx 18rpx;
  border-radius: 16rpx;
  background: rgba(212, 196, 168, 0.10);
  border: 1px solid rgba(166, 144, 118, 0.15);
  text-align: center;
}

.empty-illus {
  display: flex;
  justify-content: center;
  margin-bottom: 10rpx;
}

.empty-text {
  display: block;
  color: #9e9b94;
  font-size: 28rpx;
  margin-top: 10rpx;
}

.empty-sub {
  display: block;
  color: #9e9b94;
  font-size: 24rpx;
  margin-top: 6rpx;
}

.primary-btn {
  margin-top: 22rpx;
  height: 76rpx;
  line-height: 76rpx;
  padding: 0 34rpx;
  border-radius: 40rpx;
  background: #a69076;
  color: #fff;
  font-size: 28rpx;
  font-weight: 600;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12rpx;
  padding-bottom: 120rpx;
}

.card {
  overflow: hidden;
  border-radius: 16rpx;
  background: #fdfcf8;
  box-shadow: 0 2px 8px rgba(161, 152, 135, 0.1);
  border: 1px solid rgba(166, 144, 118, 0.15);
}

.card-image {
  width: 100%;
  height: 260rpx;
  border-radius: 8rpx;
}

.card-body {
  padding: 16rpx;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.mood {
  font-size: 22rpx;
  color: #4a4a48;
}

.card-date {
  color: #9e9b94;
  font-size: 22rpx;
}

.card-text {
  color: #4a4a48;
  font-size: 26rpx;
  line-height: 40rpx;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.fab {
  position: fixed;
  right: 18rpx;
  bottom: 22rpx;
  width: 104rpx;
  height: 104rpx;
  line-height: 104rpx;
  border-radius: 999rpx;
  background: #d4c4a8;
  color: #4a4a48;
  font-size: 46rpx;
  box-shadow: 0 4px 12px rgba(166, 144, 118, 0.3);
}
</style>
