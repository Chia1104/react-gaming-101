import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { Roulette } from '@/containers/roulette';
import { TodoStoreProvider } from '@/stores/todo/store';

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('routes.roulette');
	return {
		title: t('title'),
		description: t('description'),
	};
}

const Page = () => {
	return (
		<div className="inline-block">
			<TodoStoreProvider>
				<Roulette />
			</TodoStoreProvider>
		</div>
	);
};

export default Page;
