<template>
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <h1 class="text-3xl font-bold mb-8">购物车</h1>

    <div v-if="cartItems.length === 0" class="text-center py-16">
      <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <p class="text-gray-500 text-lg mb-6">购物车空空如也</p>
      <NuxtLink to="/artists" class="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700">
        去逛逛
      </NuxtLink>
    </div>

    <div v-else class="grid lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-4">
        <div
            v-for="item in cartItems"
            :key="item.id"
            class="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
        >
          <div class="flex gap-4">
            <div class="relative">
              <input
                  type="checkbox"
                  v-model="item.selected"
                  class="absolute top-2 left-2 w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <img
                  :src="item.product.image_url"
                  class="w-32 h-32 rounded-lg object-cover"
              />
            </div>

            <div class="flex-1">
              <div class="flex justify-between mb-2">
                <div>
                  <h3 class="font-semibold text-lg mb-1">{{ item.product.title }}</h3>
                  <p class="text-sm text-gray-600">画师: {{ item.artist.display_name }}</p>
                </div>
                <button
                    @click="removeItem(item.id)"
                    class="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div class="text-sm text-gray-600 mb-3 space-y-1">
                <p>规格: {{ item.specifications }}</p>
                <p v-if="item.is_rush" class="text-amber-600">加急服务</p>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="text-sm text-gray-600">数量:</span>
                  <div class="flex items-center border rounded-lg">
                    <button
                        @click="decreaseQuantity(item)"
                        class="px-3 py-1 hover:bg-gray-100 transition-colors"
                        :disabled="item.quantity <= 1"
                    >
                      -
                    </button>
                    <span class="px-4 py-1 border-x">{{ item.quantity }}</span>
                    <button
                        @click="increaseQuantity(item)"
                        class="px-3 py-1 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div class="text-right">
                  <div class="text-purple-600 font-bold text-xl">
                    ¥{{ (item.price * item.quantity).toLocaleString() }}
                  </div>
                  <div v-if="item.original_price > item.price" class="text-sm text-gray-400 line-through">
                    ¥{{ (item.original_price * item.quantity).toLocaleString() }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100 sticky top-20">
          <h2 class="text-xl font-semibold mb-4">订单摘要</h2>

          <div class="space-y-3 mb-4">
            <div class="flex justify-between text-gray-600">
              <span>商品金额</span>
              <span>¥{{ subtotal.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>优惠金额</span>
              <span class="text-red-500">-¥{{ discount.toLocaleString() }}</span>
            </div>
            <div v-if="shippingFee > 0" class="flex justify-between text-gray-600">
              <span>运费</span>
              <span>¥{{ shippingFee.toLocaleString() }}</span>
            </div>
          </div>

          <div class="border-t pt-3 mb-4">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold">合计</span>
              <span class="text-2xl font-bold text-purple-600">
                ¥{{ total.toLocaleString() }}
              </span>
            </div>
          </div>

          <div class="mb-4">
            <label class="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <input type="checkbox" v-model="agreeTerms" class="w-4 h-4 text-purple-600 rounded">
              我已阅读并同意
              <NuxtLink to="/terms" class="text-purple-600 hover:underline">服务条款</NuxtLink>
            </label>
          </div>

          <button
              @click="checkout"
              :disabled="!canCheckout"
              class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            结算 ({{ selectedCount }})
          </button>

          <div class="mt-4 text-center">
            <NuxtLink to="/artists" class="text-sm text-purple-600 hover:underline">
              继续购物
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const cartItems = ref([
  {
    id: '1',
    selected: true,
    product: {
      id: 'p1',
      title: '角色立绘定制',
      image_url: '/sample-art-1.jpg',
    },
    artist: {
      id: 'a1',
      display_name: '夏目画师',
    },
    specifications: '全身 | 精细上色 | PNG格式',
    quantity: 1,
    price: 800,
    original_price: 1000,
    is_rush: false,
  },
])

const agreeTerms = ref(false)

const selectedCount = computed(() => {
  return cartItems.value.filter(item => item.selected).length
})

const subtotal = computed(() => {
  return cartItems.value
      .filter(item => item.selected)
      .reduce((sum, item) => sum + item.original_price * item.quantity, 0)
})

const discount = computed(() => {
  return cartItems.value
      .filter(item => item.selected)
      .reduce((sum, item) => sum + (item.original_price - item.price) * item.quantity, 0)
})

const shippingFee = computed(() => {
  return 0 // Digital products, no shipping
})

const total = computed(() => {
  return subtotal.value - discount.value + shippingFee.value
})

const canCheckout = computed(() => {
  return selectedCount.value > 0 && agreeTerms.value
})

const removeItem = (id: string) => {
  cartItems.value = cartItems.value.filter(item => item.id !== id)
}

const increaseQuantity = (item: any) => {
  item.quantity++
}

const decreaseQuantity = (item: any) => {
  if (item.quantity > 1) {
    item.quantity--
  }
}

const checkout = () => {
  if (canCheckout.value) {
    navigateTo('/checkout')
  }
}
</script>