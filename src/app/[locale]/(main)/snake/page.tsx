import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { Snake } from '@/containers/snake';

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('routes.snake');
	return {
		title: t('title'),
		description: t('description'),
	};
}

const Page = () => {
	return (
		<div className="inline-block">
			<Snake />
		</div>
	);
};

export default Page;
