<template>
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <h1 class="text-3xl font-bold mb-8">确认订单</h1>

    <div class="grid lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-6">
        <!-- Contact Information -->
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 class="text-xl font-semibold mb-4">联系信息</h2>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">联系人</label>
              <input
                  v-model="contactInfo.name"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="请输入姓名"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">手机号</label>
              <input
                  v-model="contactInfo.phone"
                  type="tel"
                  class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="请输入手机号"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">邮箱 (用于接收作品)</label>
              <input
                  v-model="contactInfo.email"
                  type="email"
                  class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="请输入邮箱地址"
              />
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 class="text-xl font-semibold mb-4">订单商品</h2>
          <div class="space-y-4">
            <div
                v-for="item in orderItems"
                :key="item.id"
                class="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0"
            >
              <img
                  :src="item.product.image_url"
                  class="w-20 h-20 rounded-lg object-cover"
              />
              <div class="flex-1">
                <h3 class="font-medium mb-1">{{ item.product.title }}</h3>
                <p class="text-sm text-gray-600 mb-2">画师: {{ item.artist.display_name }}</p>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">x{{ item.quantity }}</span>
                  <span class="font-semibold text-purple-600">¥{{ (item.price * item.quantity).toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 class="text-xl font-semibold mb-4">支付方式</h2>
          <div class="space-y-3">
            <label
                v-for="method in paymentMethods"
                :key="method.id"
                class="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-purple-600 transition-colors"
                :class="{ 'border-purple-600 bg-purple-50': selectedPayment === method.id }"
            >
              <input
                  type="radio"
                  v-model="selectedPayment"
                  :value="method.id"
                  class="w-5 h-5 text-purple-600"
              />
              <img :src="method.icon" class="w-8 h-8" />
              <div class="flex-1">
                <div class="font-medium">{{ method.name }}</div>
                <div class="text-sm text-gray-600">{{ method.description }}</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Invoice -->
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">发票信息</h2>
            <label class="flex items-center gap-2">
              <input
                  type="checkbox"
                  v-model="needInvoice"
                  class="w-4 h-4 text-purple-600 rounded"
              />
              <span class="text-sm">需要发票</span>
            </label>
          </div>

          <div v-if="needInvoice" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">发票类型</label>
              <div class="flex gap-4">
                <label class="flex items-center gap-2">
                  <input
                      type="radio"
                      v-model="invoiceType"
                      value="personal"
                      class="w-4 h-4 text-purple-600"
                  />
                  <span>个人</span>
                </label>
                <label class="flex items-center gap-2">
                  <input
                      type="radio"
                      v-model="invoiceType"
                      value="company"
                      class="w-4 h-4 text-purple-600"
                  />
                  <span>企业</span>
                </label>
              </div>
            </div>

            <div v-if="invoiceType === 'company'">
              <label class="block text-sm font-medium text-gray-700 mb-2">公司名称</label>
              <input
                  v-model="invoiceInfo.companyName"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="请输入公司名称"
              />
            </div>

            <div v-if="invoiceType === 'company'">
              <label class="block text-sm font-medium text-gray-700 mb-2">税号</label>
              <input
                  v-model="invoiceInfo.taxNumber"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="请输入税号"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100 sticky top-20">
          <h2 class="text-xl font-semibold mb-4">订单金额</h2>

          <div class="space-y-3 mb-4">
            <div class="flex justify-between text-gray-600">
              <span>商品金额</span>
              <span>¥{{ subtotal.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>优惠金额</span>
              <span class="text-red-500">-¥{{ discount.toLocaleString() }}</span>
            </div>
          </div>

          <div class="border-t pt-3 mb-6">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold">应付金额</span>
              <span class="text-2xl font-bold text-purple-600">
                ¥{{ total.toLocaleString() }}
              </span>
            </div>
          </div>

          <div class="mb-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div class="flex gap-2 text-sm text-amber-800">
              <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <div>
                <div class="font-medium mb-1">订单说明</div>
                <div class="text-xs">
                  提交订单后，画师将在24小时内与您确认需求细节。请保持手机畅通。
                </div>
              </div>
            </div>
          </div>

          <button
              @click="submitOrder"
              :disabled="!canSubmit"
              class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors mb-3"
          >
            提交订单
          </button>

          <div class="text-center text-xs text-gray-500">
            提交订单即表示同意
            <NuxtLink to="/terms" class="text-purple-600 hover:underline">服务条款</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const contactInfo = ref({
  name: '',
  phone: '',
  email: '',
})

const orderItems = ref([
  {
    id: '1',
    product: {
      title: '角色立绘定制',
      image_url: '/sample-art-1.jpg',
    },
    artist: {
      display_name: '夏目画师',
    },
    quantity: 1,
    price: 800,
  },
])

const paymentMethods = ref([
  {
    id: 'wechat',
    name: '微信支付',
    description: '推荐使用',
    icon: '/wechat-pay.svg',
  },
  {
    id: 'alipay',
    name: '支付宝',
    description: '安全快捷',
    icon: '/alipay.svg',
  },
])

const selectedPayment = ref('wechat')
const needInvoice = ref(false)
const invoiceType = ref('personal')
const invoiceInfo = ref({
  companyName: '',
  taxNumber: '',
})

const subtotal = computed(() => {
  return orderItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const discount = computed(() => 0)

const total = computed(() => subtotal.value - discount.value)

const canSubmit = computed(() => {
  return contactInfo.value.name &&
      contactInfo.value.phone &&
      contactInfo.value.email &&
      selectedPayment.value
})

const submitOrder = async () => {
  if (!canSubmit.value) return

  // Submit order logic
  console.log('Submitting order...', {
    contactInfo: contactInfo.value,
    orderItems: orderItems.value,
    paymentMethod: selectedPayment.value,
    invoice: needInvoice.value ? invoiceInfo.value : null,
  })

  // Navigate to payment page
  navigateTo('/payment/processing')
}
</script>