import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: 'node',
		passWithNoTests: true,
		setupFiles: ['dotenv/config'],
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			test: path.resolve(__dirname, './__tests__'),
		},
	},
});
