declare type PartialK<T, K extends PropertyKey = PropertyKey> = Partial<Pick<T, Extract<keyof T, K>>> &
	Omit<T, K> extends infer O
	? { [P in keyof O]: O[P] }
	: never;

declare type DeepPartial<T> = T extends object
	? {
			[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
		}
	: T;
