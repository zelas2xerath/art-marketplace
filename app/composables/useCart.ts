import {useAuth} from "./useAuth";

export const useCart = () => {
    const config = useRuntimeConfig()
    const { token } = useAuth()

    interface CartItem {
        id: string
        product_id: string
        artist_id: string
        quantity: number
        price: number
        specifications?: string
        is_rush?: boolean
        selected?: boolean
    }

    const cartItems = useState<CartItem[]>('cart:items', () => [])
    const cartCount = computed(() => cartItems.value.reduce((sum, item) => sum + item.quantity, 0))
    const selectedItems = computed(() => cartItems.value.filter(item => item.selected))
    const selectedTotal = computed(() => {
        return selectedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
    })

    const fetchCart = async () => {
        if (!token.value) {
            return
        }

        try {
            const data = await $fetch<{ items: CartItem[] }>(`${config.public.apiBase}/cart`, {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
            })

            cartItems.value = data.items.map(item => ({ ...item, selected: true }))
        } catch (error) {
            console.error('Failed to fetch cart:', error)
        }
    }

    const addToCart = async (item: Omit<CartItem, 'id'>) => {
        try {
            const data = await $fetch<{ item: CartItem }>(`${config.public.apiBase}/cart/items`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
                body: item,
            })

            cartItems.value.push({ ...data.item, selected: true })
            return { success: true }
        } catch (error) {
            console.error('Failed to add to cart:', error)
            return { success: false, error }
        }
    }

    const updateCartItem = async (itemId: string, updates: Partial<CartItem>) => {
        try {
            const data = await $fetch<{ item: CartItem }>(`${config.public.apiBase}/cart/items/${itemId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
                body: updates,
            })

            const index = cartItems.value.findIndex(item => item.id === itemId)
            if (index !== -1) {
                cartItems.value[index] = { ...cartItems.value[index], ...data.item }
            }

            return { success: true }
        } catch (error) {
            console.error('Failed to update cart item:', error)
            return { success: false, error }
        }
    }

    const removeFromCart = async (itemId: string) => {
        try {
            await $fetch(`${config.public.apiBase}/cart/items/${itemId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
            })

            cartItems.value = cartItems.value.filter(item => item.id !== itemId)
            return { success: true }
        } catch (error) {
            console.error('Failed to remove from cart:', error)
            return { success: false, error }
        }
    }

    const clearCart = async () => {
        try {
            await $fetch(`${config.public.apiBase}/cart`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
            })

            cartItems.value = []
            return { success: true }
        } catch (error) {
            console.error('Failed to clear cart:', error)
            return { success: false, error }
        }
    }

    const toggleItemSelection = (itemId: string) => {
        const item = cartItems.value.find(i => i.id === itemId)
        if (item) {
            item.selected = !item.selected
        }
    }

    const selectAll = () => {
        cartItems.value.forEach(item => {
            item.selected = true
        })
    }

    const deselectAll = () => {
        cartItems.value.forEach(item => {
            item.selected = false
        })
    }

    return {
        cartItems: readonly(cartItems),
        cartCount,
        selectedItems,
        selectedTotal,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        toggleItemSelection,
        selectAll,
        deselectAll,
    }
}