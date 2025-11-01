'use client';

import { useId, ViewTransition, useRef } from 'react';

import { useTranslations } from 'next-intl';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Game } from '@/enums/game.enum';
import { useTicTacToeStore } from '@/features/tic-tac-toe/store';

const sizeSchema = z.number().int().min(3).max(10);

export const TicTacToe = () => {
	const changeSize = useTicTacToeStore(state => state.changeSize, 'TicTacToe');
	const size = useTicTacToeStore(state => state.size, 'TicTacToe');
	const board = useTicTacToeStore(state => state.board, 'TicTacToe');
	const player = useTicTacToeStore(state => state.currentPlayer, 'TicTacToe');
	const winner = useTicTacToeStore(state => state.winner, 'TicTacToe');
	const isDraw = useTicTacToeStore(state => state.isDraw, 'TicTacToe');
	const makeMove = useTicTacToeStore(state => state.makeMove, 'TicTacToe');
	const resetGame = useTicTacToeStore(state => state.resetGame, 'TicTacToe');

	const t = useTranslations();
	const id = useId();
	const inputRef = useRef<HTMLInputElement>(null);

	const handleConfirmSize = () => {
		const newSize = Number(inputRef.current?.value);
		if (!sizeSchema.safeParse(newSize).success) return;
		changeSize(newSize);
	};

	return (
		<ViewTransition>
			<div className="rounded-2xl shadow-2xl p-8 max-w-2xl w-full bg-foreground/5 backdrop-blur-xl flex flex-col items-center justify-center">
				<h2
					className="text-4xl font-bold text-center mb-8"
					style={{
						viewTransitionName: `game-${Game.TicTacToe}`,
					}}
				>
					{t('routes.tic-tac-toe.title')}
				</h2>

				<div className="grid w-full max-w-sm items-center gap-3 mb-6">
					<Label htmlFor={id}>{t('tic-tac-toe.set-size')}</Label>
					<div className="flex w-full max-w-sm items-center gap-2">
						<Input
							type="number"
							id={id}
							placeholder={t('tic-tac-toe.set-size')}
							min={3}
							max={10}
							ref={inputRef}
							defaultValue={size}
						/>
						<Button onClick={handleConfirmSize}>{t('tic-tac-toe.set-size')}</Button>
					</div>
					<p className="text-xs text-muted-foreground">{t('tic-tac-toe.size-description')}</p>
				</div>

				<div className="text-center mb-6">
					<p className="text-lg font-semibold text-muted-foreground">
						{winner
							? t('tic-tac-toe.winner', { winner })
							: isDraw
								? t('tic-tac-toe.draw')
								: t('tic-tac-toe.current-player', { player: player ?? '' })}
					</p>
				</div>

				<div
					className="grid gap-2 mb-8 justify-items-center mx-auto"
					style={{
						gridTemplateColumns: `repeat(${size}, 1fr)`,
						maxWidth: `${size * 80}px`,
					}}
				>
					{Array.from({ length: size * size }, (_, i) => {
						const buttonSize = size <= 4 ? '60px' : size <= 5 ? '50px' : '40px';
						const fontSize = size <= 4 ? '1.5rem' : size <= 5 ? '1.25rem' : '1rem';

						return (
							<Button
								key={`square-${i}-${size}`}
								style={{
									width: buttonSize,
									height: buttonSize,
									fontSize: fontSize,
								}}
								size="icon"
								variant="outline"
								onClick={() => makeMove(i)}
								disabled={winner !== null || isDraw}
							>
								{board[i]}
							</Button>
						);
					})}
				</div>

				<Button onClick={resetGame}>{t('tic-tac-toe.reset')}</Button>

				<div className="mt-8 text-center text-sm text-muted-foreground">
					<p>{t('tic-tac-toe.description', { size: size.toString() })}</p>
				</div>
			</div>
		</ViewTransition>
	);
};
