'use client';

import { ViewTransition } from 'react';

import { useTranslations } from 'next-intl';

import { Game } from '@/enums/game.enum';

export const Snake = () => {
	const t = useTranslations();

	return (
		<ViewTransition>
			<div className="rounded-2xl shadow-2xl p-8 max-w-4xl w-full bg-foreground/5 backdrop-blur-xl flex flex-col items-center justify-center gap-8">
				<h2
					className="text-4xl font-bold text-center"
					style={{
						viewTransitionName: `game-${Game.Snake}`,
					}}
				>
					{t('routes.snake.title')}
				</h2>

				<div className="flex flex-col items-center justify-center gap-4 p-12 text-center text-muted-foreground">
					<p className="text-lg">{t('routes.snake.description')}</p>
					<p className="text-sm">遊戲開發中...</p>
				</div>
			</div>
		</ViewTransition>
	);
};
