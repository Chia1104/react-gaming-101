import { ViewTransition } from 'react';

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { TicTacToe } from '@/containers/tic-tac-toe';

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('routes.tic-tac-toe');
	return {
		title: t('title'),
	};
}

const Page = () => {
	return (
		<ViewTransition>
			<TicTacToe />
		</ViewTransition>
	);
};

export default Page;
