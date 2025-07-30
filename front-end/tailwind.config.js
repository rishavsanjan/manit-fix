// tailwind.config.js
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            keyframes: {
                gradient: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
            },
            animation: {
                'gradient-bg': 'gradient 15s ease infinite',
            },
            backgroundSize: {
                'size-400': '400% 400%',
            },
            backgroundImage: {
                'animated-gradient': 'linear-gradient(-45deg, #4f46e5, #9333ea, #6366f1, #3b82f6)',
            },
        },
    },
    plugins: [],
}
