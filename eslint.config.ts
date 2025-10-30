import baseConfig from './eslint/base.js';
import nextjsConfig from './eslint/nextjs.js';
import reactConfig from './eslint/react.js';
import { defineConfig } from "eslint/config";

export default defineConfig(
	{
	  ignores: ["**/*.d.ts", '.next/**', 'public/**'],
	},
	baseConfig,
	reactConfig,
	nextjsConfig
  );
