import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { Roulette } from '@/containers/roulette';

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('routes.roulette');
	return {
		title: t('title'),
	};
}

const Page = () => {
	return (
		<div className="inline-block">
			<Roulette />
		</div>
	);
};

export default Page;
