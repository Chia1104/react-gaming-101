import type { Viewport } from 'next';

import '@/themes/styles.css';

interface Props {
	children: React.ReactNode;
}

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

const Layout = ({ children }: Props) => {
	return children;
};

export default Layout;
