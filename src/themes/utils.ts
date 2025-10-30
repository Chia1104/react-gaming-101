export const theme =
	typeof window !== 'undefined'
		? getComputedStyle(document.documentElement)
		: {
				getPropertyValue: () => '',
			};