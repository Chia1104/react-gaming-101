'use client';

import { ViewTransition } from 'react';

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSelectedLayoutSegments } from 'next/navigation';

import type { Game } from '@/enums/game.enum';
import { cn } from '@/libs/utils/cn';

import { Skeleton } from '../ui/skeleton';

const AnimatedThemeToggler = dynamic(
	() => import('../ui/animated-theme-toggler').then(mod => mod.AnimatedThemeToggler),
	{
		ssr: false,
		loading: () => (
			<ViewTransition>
				<Skeleton className="size-9 rounded-full" />
			</ViewTransition>
		),
	},
);

export const NavBar = ({ className }: { className?: string }) => {
	const t = useTranslations();
	const segments = useSelectedLayoutSegments();
	const game = segments?.[0] as Game | undefined;

	return (
		<nav
			className={cn(
				'flex items-center justify-between bg-foreground/5 backdrop-blur-2xl py-3 px-5 rounded-full shadow-xl',
				className,
			)}
		>
			<div className="flex items-center justify-center gap-2 text-muted-foreground">
				<Link href="/">{t(`meta.title`)}</Link>
				{game && <Link href={`/${game}`}>/ {t(`routes.${game}.title`)}</Link>}
			</div>
			<ul>
				<li>
					<AnimatedThemeToggler className="rounded-full" />
				</li>
			</ul>
		</nav>
	);
};
