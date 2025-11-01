export const Game = {
	TicTacToe: 'tic-tac-toe',
	Roulette: 'roulette',
	Game2048: '2048',
	Sudoku: 'sudoku',
	Snake: 'snake',
} as const;

export type Game = (typeof Game)[keyof typeof Game];
