/** @type {import('tailwindcss').Config} */

export default {
  presets: [require('@jarvis-helpdesk-plugins/shared/tailwind.config')],
  content: ['./src/**/*.{html,js,ts,jsx,tsx}', '../../packages/shared/src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        popup: '0 7px 18px 0 rgba(0, 0, 0, 0.09)',
      },
    },
  },
};
