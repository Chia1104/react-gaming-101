import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { Sudoku } from '@/containers/sudoku';

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('routes.sudoku');
	return {
		title: t('title'),
		description: t('description'),
	};
}

const Page = () => {
	return (
		<div className="inline-block">
			<Sudoku />
		</div>
	);
};

export default Page;
