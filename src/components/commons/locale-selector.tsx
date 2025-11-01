'use client';

import { useTranslations } from 'next-intl';
import type { Locale as TLocale } from 'next-intl';
import { useLocale } from 'next-intl';

import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Locale } from '@/enums/locale.enum';
import { useLocaleRouter, usePathname } from '@/libs/i18n/routing';

export const LocaleSelector = () => {
	const t = useTranslations('locale');
	const locale = useLocale();
	const router = useLocaleRouter();
	const pathname = usePathname();
	const changeLocale = (locale: TLocale) => {
		router.push(pathname, { locale });
		router.refresh();
	};
	return (
		<Select onValueChange={changeLocale} defaultValue={locale}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Select Language" />
			</SelectTrigger>
			<SelectContent>
				{Object.values(Locale).map(locale => (
					<SelectItem key={locale} value={locale}>
						{t(locale)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};
