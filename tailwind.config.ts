import {designTokens, glassEffects} from './app/config/design-tokens'

export default {
    content: [
        './app/components/**/*.{vue,js,ts}',
        './app/pages/**/*.{vue,js,ts}',
        './app/layouts/**/*.{vue,js,ts}',
        './app/app.vue',
    ],
    theme: {
    	container: {
    		center: true,
    		padding: '2rem',
    		screens: {
    			'2xl': '1400px'
    		}
    	},
    	extend: {
    		colors: {
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			primary: {
                    ...designTokens.colors.primary,
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
                    ...designTokens.colors.secondary,
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			gray: designTokens.colors.neutral.gray,
    			success: designTokens.colors.semantic.success,
    			warning: designTokens.colors.semantic.warning,
    			error: designTokens.colors.semantic.error,
    			info: designTokens.colors.semantic.info,
    			'role-client': designTokens.colors.roles.client,
    			'role-artist': designTokens.colors.roles.artist,
    			'role-admin': designTokens.colors.roles.admin,
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		opacity: designTokens.colors.opacity,
    		backdropBlur: {
    			xs: '2px',
    			sm: '4px',
    			DEFAULT: '8px',
    			md: '12px',
    			lg: '16px',
    			xl: '24px',
    			'2xl': '40px',
    			'3xl': '64px',
				'glass': '8px',
				'glass-md': '12px',
				'glass-lg': '16px',
    		},
    		fontFamily: designTokens.typography.fontFamily,
    		fontSize: designTokens.typography.fontSize,
    		fontWeight: designTokens.typography.fontWeight,
    		spacing: designTokens.spacing,
    		gap: designTokens.spacing,
    		boxShadow: designTokens.shadows,
    		borderRadius: {
                ...designTokens.borderRadius,
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		transitionDuration: designTokens.animation.duration,
    		transitionTimingFunction: designTokens.animation.easing,
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--reka-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--reka-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		},
    		screens: designTokens.breakpoints,
			backgroundImage: {
				'glass-light': glassEffects.light.background,
				'glass-medium': glassEffects.medium.background,
				'glass-heavy': glassEffects.heavy.background,
			},
    	}
    },
    plugins: [
		require('@tailwindcss/forms'), // 表单样式
		require('@tailwindcss/typography'), // 内容排版
		require('@tailwindcss/aspect-ratio'), // 宽高比
	],
}
