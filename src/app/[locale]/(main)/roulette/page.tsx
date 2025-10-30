import { ViewTransition } from 'react';

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('routes.roulette');
	return {
		title: t('title'),
	};
}

const Page = () => {
	return (
		<ViewTransition>
			<div>Roulette</div>
		</ViewTransition>
	);
};

export default Page;
