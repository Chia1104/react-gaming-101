'use client';

import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google';
import dynamic from 'next/dynamic';
import { Toaster } from 'sonner';

import { env } from '@/libs/env';

const ReactQueryDevtools = dynamic(() => import('@tanstack/react-query-devtools').then(mod => mod.ReactQueryDevtools), {
	ssr: false,
});

const ToasterPlugin = () => {
	return <Toaster theme="dark" position="top-center" richColors />;
};

const AppPlugins = () => {
	return (
		<>
			<ToasterPlugin />
			<ReactQueryDevtools initialIsOpen={false} buttonPosition="top-left" />
			{env.NEXT_PUBLIC_GTM_ID && (
				<GoogleTagManager
					gtmId={env.NEXT_PUBLIC_GTM_ID}
					auth={env.NEXT_PUBLIC_GTM_AUTH}
					preview={env.NEXT_PUBLIC_GTM_PREVIEW}
				/>
			)}
			{env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_ID} />}
		</>
	);
};

export default AppPlugins;
