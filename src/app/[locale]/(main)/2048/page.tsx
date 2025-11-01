import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { Game2048 } from '@/containers/game-2048';

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('routes.2048');
	return {
		title: t('title'),
		description: t('description'),
	};
}

const Page = () => {
	return (
		<div className="inline-block">
			<Game2048 />
		</div>
	);
};

export default Page;
