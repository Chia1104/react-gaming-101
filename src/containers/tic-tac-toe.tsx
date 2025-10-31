'use client';

import { useState, useMemo, useId, ViewTransition } from 'react';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Player = 'X' | 'O' | null;
type Board = Player[];

function generateWinPatterns(size: number): number[][] {
	const patterns: number[][] = [];

	// 生成行的勝利模式
	for (let row = 0; row < size; row++) {
		const pattern: number[] = [];
		for (let col = 0; col < size; col++) {
			pattern.push(row * size + col);
		}
		patterns.push(pattern);
	}

	// 生成列的勝利模式
	for (let col = 0; col < size; col++) {
		const pattern: number[] = [];
		for (let row = 0; row < size; row++) {
			pattern.push(row * size + col);
		}
		patterns.push(pattern);
	}

	// 生成主對角線的勝利模式
	const mainDiagonal: number[] = [];
	for (let i = 0; i < size; i++) {
		mainDiagonal.push(i * size + i);
	}
	patterns.push(mainDiagonal);

	// 生成副對角線的勝利模式
	const antiDiagonal: number[] = [];
	for (let i = 0; i < size; i++) {
		antiDiagonal.push(i * size + (size - 1 - i));
	}
	patterns.push(antiDiagonal);

	return patterns;
}

function getWinner(board: Board, size: number) {
	const winPatterns = generateWinPatterns(size);

	for (const pattern of winPatterns) {
		const firstCell = board[pattern[0]];
		if (firstCell && pattern.every(index => board[index] === firstCell)) {
			return firstCell; // 回傳 'X' 或 'O'
		}
	}
	return null;
}

function useTicTacToe() {
	const [size, setSize] = useState(3);
	const [board, setBoard] = useState<Board>(Array(size * size).fill(null));
	const [player, setPlayer] = useState<Player>('X');

	// 🧩 即時計算勝負狀態（用 useMemo 避免不必要計算）
	const winner = useMemo(() => getWinner(board, size), [board, size]);

	// ✅ 判斷普通平手
	const isFull = useMemo(() => board.every(Boolean), [board]);
	const isDraw = useMemo(() => !winner && isFull, [winner, isFull]);

	function makeMove(index: number) {
		if (board[index] || winner || isDraw) return; // 已結束或佔用

		const next = [...board];
		next[index] = player;
		setBoard(next);
		setPlayer(player === 'X' ? 'O' : 'X');
	}

	function resetGame() {
		setBoard(Array(size * size).fill(null));
		setPlayer('X');
	}

	function changeSize(newSize: number) {
		setSize(newSize);
		setBoard(Array(newSize * newSize).fill(null));
		setPlayer('X');
	}

	return {
		size,
		board,
		player,
		winner,
		isDraw,
		makeMove,
		resetGame,
		changeSize,
	};
}

export const TicTacToe = () => {
	const { size, board, player, winner, isDraw, makeMove, resetGame, changeSize } = useTicTacToe();
	const t = useTranslations();
	const id = useId();
	const [newSize, setNewSize] = useState(size);

	const handleConfirmSize = () => {
		if (newSize < 3 || newSize > 10) return;
		changeSize(newSize);
	};

	return (
		<ViewTransition>
			<div className="rounded-2xl shadow-2xl p-8 max-w-2xl w-full bg-foreground/5 backdrop-blur-xl flex flex-col items-center justify-center">
				<h2 className="text-4xl font-bold text-center mb-8">{t('routes.tic-tac-toe.title')}</h2>

				<div className="grid w-full max-w-sm items-center gap-3 mb-6">
					<Label htmlFor={id}>{t('tic-tac-toe.set-size')}</Label>
					<div className="flex w-full max-w-sm items-center gap-2">
						<Input
							type="number"
							id={id}
							placeholder={t('tic-tac-toe.set-size')}
							min={3}
							max={10}
							value={newSize}
							onChange={e => setNewSize(Number(e.target.value))}
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
