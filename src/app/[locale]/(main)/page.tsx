'use client';

import { ViewTransition, useMemo } from 'react';

import { Accordion } from '@heroui/react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Game } from '@/enums/game.enum';

const Page = () => {
	const t = useTranslations();

	const items = useMemo(() => {
		return Object.values(Game).map(item => {
			return {
				key: item,
				title: t(`routes.${item}.title`),
				description: t(`routes.${item}.description`),
			};
		});
	}, [t]);
	return (
		<ViewTransition>
			<div className="flex flex-col items-center justify-center gap-4 w-full">
				<Accordion.Root className="w-full max-w-md" variant="outline">
					{items.map(item => (
						<Accordion.Item key={item.key}>
							<Accordion.Heading>
								<Accordion.Trigger>
									{item.title}
									<Accordion.Indicator className="text-muted-foreground size-4 shrink-0">
										<ChevronDown />
									</Accordion.Indicator>
								</Accordion.Trigger>
							</Accordion.Heading>
							<Accordion.Panel>
								<Accordion.Body className="flex flex-col items-start justify-start gap-2">
									<p className="text-sm text-muted-foreground">{item.description}</p>
									<Link href={`/${item.key}`} className="text-muted-foreground">
										<Button variant="outline">{t('action.play')}</Button>
									</Link>
								</Accordion.Body>
							</Accordion.Panel>
						</Accordion.Item>
					))}
				</Accordion.Root>
			</div>
		</ViewTransition>
	);
};

export default Page;
