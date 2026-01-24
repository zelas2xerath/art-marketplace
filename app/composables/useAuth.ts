export const useAuth = () => {
    const config = useRuntimeConfig()
    const user = useState<User | null>('auth:user', () => null)
    const token = useState<string | null>('auth:token', () => null)
    const isAuthenticated = computed(() => !!user.value)

    interface User {
        id: string
        email: string
        display_name: string
        avatar_url?: string
        role: 'customer' | 'artist' | 'admin'
        is_artist: boolean
    }

    interface LoginCredentials {
        email: string
        password: string
    }

    interface RegisterData {
        email: string
        password: string
        display_name: string
    }

    const login = async (credentials: LoginCredentials) => {
        try {
            const data = await $fetch<{ user: User; token: string }>(`${config.public.apiBase}/auth/login`, {
                method: 'POST',
                body: credentials,
            })

            user.value = data.user
            token.value = data.token

            // Store token in cookie for SSR
            const tokenCookie = useCookie('auth_token', {
                maxAge: 60 * 60 * 24 * 7, // 7 days
                secure: true,
                sameSite: 'strict',
            })
            tokenCookie.value = data.token

            return { success: true }
        } catch (error) {
            console.error('Login failed:', error)
            return { success: false, error }
        }
    }

    const register = async (data: RegisterData) => {
        try {
            const response = await $fetch<{ user: User; token: string }>(`${config.public.apiBase}/auth/register`, {
                method: 'POST',
                body: data,
            })

            user.value = response.user
            token.value = response.token

            const tokenCookie = useCookie('auth_token')
            tokenCookie.value = response.token

            return { success: true }
        } catch (error) {
            console.error('Registration failed:', error)
            return { success: false, error }
        }
    }

    const logout = async () => {
        try {
            if (token.value) {
                await $fetch(`${config.public.apiBase}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token.value}`,
                    },
                })
            }
        } catch (error) {
            console.error('Logout failed:', error)
        } finally {
            user.value = null
            token.value = null

            const tokenCookie = useCookie('auth_token')
            tokenCookie.value = null

            navigateTo('/login')
        }
    }

    const fetchUser = async () => {
        const tokenCookie = useCookie('auth_token')
        if (!tokenCookie.value) {
            return
        }

        try {
            const data = await $fetch<{ user: User }>(`${config.public.apiBase}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${tokenCookie.value}`,
                },
            })

            user.value = data.user
            token.value = tokenCookie.value
        } catch (error) {
            console.error('Failed to fetch user:', error)
            tokenCookie.value = null
        }
    }

    const updateProfile = async (updates: Partial<User>) => {
        try {
            const data = await $fetch<{ user: User }>(`${config.public.apiBase}/auth/profile`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
                body: updates,
            })

            user.value = data.user
            return { success: true }
        } catch (error) {
            console.error('Profile update failed:', error)
            return { success: false, error }
        }
    }

    return {
        user: readonly(user),
        token: readonly(token),
        isAuthenticated,
        login,
        register,
        logout,
        fetchUser,
        updateProfile,
    }
}