export const Game = {
	TicTacToe: 'tic-tac-toe',
	Roulette: 'roulette',
} as const;

export type Game = (typeof Game)[keyof typeof Game];
