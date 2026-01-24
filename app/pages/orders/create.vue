<!-- frontend/pages/orders/create.vue -->
<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <h1 class="text-3xl font-bold mb-8">创建定制订单</h1>

    <form @submit.prevent="submitOrder" class="space-y-6">
      <!-- 选择服务 -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">选择服务类型</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label
              v-for="service in services"
              :key="service.id"
              class="border-2 rounded-lg p-4 cursor-pointer hover:border-purple-600"
              :class="{ 'border-purple-600 bg-purple-50': selectedService === service.id }"
          >
            <input type="radio" v-model="selectedService" :value="service.id" class="hidden" />
            <div class="text-lg font-semibold mb-2">{{ service.title }}</div>
            <div class="text-gray-600 text-sm mb-2">{{ service.description }}</div>
            <div class="text-purple-600 font-bold">¥{{ service.price }}</div>
          </label>
        </div>
      </div>

      <!-- 需求描述 -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">详细需求</h2>
        <textarea
            v-model="requirements"
            placeholder="请详细描述您的需求，包括风格、尺寸、用途等..."
            class="w-full h-32 border rounded-lg p-3"
        ></textarea>
      </div>

      <!-- 参考图片 -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">上传参考图（可选）</h2>
        <input
            type="file"
            multiple
            accept="image/*"
            @change="handleFileUpload"
            class="mb-4"
        />
        <div class="grid grid-cols-4 gap-4">
          <div v-for="(img, idx) in referenceImages" :key="idx" class="relative">
            <img :src="img" class="w-full h-24 object-cover rounded" />
            <button @click="removeImage(idx)" class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6">×</button>
          </div>
        </div>
      </div>

      <!-- 加急选项 -->
      <div class="bg-white p-6 rounded-lg shadow">
        <label class="flex items-center gap-3">
          <input type="checkbox" v-model="isRush" class="w-5 h-5" />
          <span class="text-lg">加急服务 (+¥{{ rushFee }})</span>
        </label>
      </div>

      <!-- 价格汇总 -->
      <div class="bg-purple-50 p-6 rounded-lg">
        <div class="flex justify-between mb-2">
          <span>服务费用:</span>
          <span>¥{{ basePrice }}</span>
        </div>
        <div v-if="isRush" class="flex justify-between mb-2">
          <span>加急费用:</span>
          <span>¥{{ rushFee }}</span>
        </div>
        <div class="flex justify-between text-xl font-bold pt-2 border-t">
          <span>总计:</span>
          <span class="text-purple-600">¥{{ totalPrice }}</span>
        </div>
      </div>

      <button type="submit" class="w-full bg-purple-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-purple-700">
        确认下单
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
const selectedService = ref('')
const requirements = ref('')
const referenceImages = ref<string[]>([])
const isRush = ref(false)

const { data: services } = await useFetch('/api/products')

const basePrice = computed(() => {
  const service = services.value?.find(s => s.id === selectedService.value)
  return service?.price || 0
})

const rushFee = computed(() => {
  const service = services.value?.find(s => s.id === selectedService.value)
  return service?.metadata?.rush_fee || 0
})

const totalPrice = computed(() => {
  return basePrice.value + (isRush.value ? rushFee.value : 0)
})

const submitOrder = async () => {
  // 创建订单逻辑
  const orderData = {
    product_id: selectedService.value,
    requirements: requirements.value,
    reference_images: referenceImages.value,
    is_rush: isRush.value,
  }

  const { data } = await useFetch('/api/orders', {
    method: 'POST',
    body: orderData,
  })

  if (data.value) {
    navigateTo(`/orders/${data.value.id}/payment`)
  }
}
</script>