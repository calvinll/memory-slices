<template>
  <view class="page">
    <view class="header">
      <text class="title">记忆切片</text>
      <u-button type="primary" size="small" @click="goCreate">+</u-button>
    </view>

    <view v-if="cards.length === 0" class="empty">
      <text class="empty-text">还没有记忆，点右上角 “+” 新建一条</text>
    </view>

    <view v-else class="list">
      <view v-for="card in cards" :key="card.id" class="card" @click="openCard(card.id)">
        <image v-if="card.imagePath" class="card-image" :src="card.imagePath" mode="aspectFill" />
        <view class="card-body">
          <view class="card-meta">
            <u-tag :text="moodLabel(card.mood)" size="mini" :type="moodType(card.mood)" />
            <text class="card-date">{{ formatDate(card.createdAt) }}</text>
          </view>
          <text class="card-text" :class="{ 'with-image': !!card.imagePath }">{{ card.text }}</text>
        </view>
      </view>
    </view>
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

function goCreate() {
  uni.navigateTo({ url: '/pages/create/index' })
}

function openCard(id: string) {
  uni.showToast({ title: `TODO 详情页：${id}`, icon: 'none' })
}

function moodLabel(mood: Mood) {
  if (mood === 'happy') return '开心'
  if (mood === 'sad') return '难过'
  return '平静'
}

function moodType(mood: Mood) {
  if (mood === 'happy') return 'success'
  if (mood === 'sad') return 'error'
  return 'info'
}

function formatDate(ts: number) {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
</script>

<style scoped lang="scss">
.page {
  padding: 24rpx;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12rpx 0 24rpx;
}

.title {
  font-size: 40rpx;
  font-weight: 700;
  color: #111;
}

.empty {
  padding: 80rpx 24rpx;
  text-align: center;
}

.empty-text {
  color: #888;
  font-size: 28rpx;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.card {
  display: flex;
  overflow: hidden;
  border-radius: 16rpx;
  background: #fff;
  box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.06);
}

.card-image {
  width: 180rpx;
  height: 180rpx;
  flex: 0 0 180rpx;
}

.card-body {
  flex: 1;
  padding: 18rpx;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.card-date {
  color: #999;
  font-size: 24rpx;
}

.card-text {
  color: #222;
  font-size: 28rpx;
  line-height: 40rpx;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-text.with-image {
  -webkit-line-clamp: 2;
}
</style>
