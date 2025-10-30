'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useSelectedLayoutSegments } from 'next/navigation';

import type { Game } from '@/enums/game.enum';
import { cn } from '@/libs/utils/cn';

import { AnimatedThemeToggler } from '../ui/animated-theme-toggler';

export const NavBar = ({ className }: { className?: string }) => {
	const t = useTranslations();
	const segments = useSelectedLayoutSegments();
	const game = segments?.[1] as Game;

	return (
		<nav
			className={cn(
				'flex items-center justify-between bg-foreground/5 backdrop-blur-2xl py-3 px-5 rounded-full shadow-xl',
				className,
			)}
		>
			<div>
				<Link href="/">{t(`meta.title`)}</Link>
			</div>
			<ul>
				<AnimatedThemeToggler className="rounded-full" />
			</ul>
		</nav>
	);
};
