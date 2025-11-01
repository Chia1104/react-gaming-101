import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { TicTacToe } from '@/containers/tic-tac-toe';
import { TicTacToeStoreProvider } from '@/features/tic-tac-toe/store';

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('routes.tic-tac-toe');
	return {
		title: t('title'),
		description: t('description'),
	};
}

const Page = () => {
	return (
		<div className="inline-block">
			<TicTacToeStoreProvider>
				<TicTacToe />
			</TicTacToeStoreProvider>
		</div>
	);
};

export default Page;
