const sharedConfig = require('@boilerplate/config/tailwind.config.js')

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...sharedConfig,
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
}