'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { cn } from '@/libs/utils/cn';
import dayjs from '@/libs/utils/dayjs';

import { Button } from '../ui/button';
import { TextPath } from '../ui/text-path';
import { LocaleSelector } from './locale-selector';

export const Footer = ({ className }: { className?: string }) => {
	const t = useTranslations();
	return (
		<footer
			className={cn(
				'w-full py-8 px-5 mt-auto',
				'bg-foreground/5 backdrop-blur-2xl',
				'border-t border-border/50',
				className,
			)}
		>
			<div className="container mx-auto max-w-6xl">
				<div className="flex flex-col items-center justify-center gap-6">
					<div className="w-full max-w-md relative overflow-hidden">
						<TextPath text={t('meta.title')} svgProps={{ viewBox: '0 0 650 100' }} />
						<div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-2/3 h-6 blur-lg pointer-events-none opacity-20 bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,var(--color-primary)_50%),radial-gradient(rgba(200,200,200,0.1)_0%,transparent_80%)]" />
					</div>

					<div className="w-full max-w-md h-px bg-linear-to-r from-transparent via-border to-transparent -mt-6" />

					<ul className="flex items-center justify-center gap-2">
						<li>
							<Link href="https://github.com/Chia1104/react-gaming-101" target="_blank">
								<Button variant="ghost" size="icon">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
										<title>GitHub</title>
										<path
											d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
											fill="currentColor"
										/>
									</svg>
								</Button>
							</Link>
						</li>
						<li>
							<LocaleSelector />
						</li>
					</ul>

					<p className="text-sm text-muted-foreground text-center">
						© {dayjs().year()} React Gaming 101. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};
