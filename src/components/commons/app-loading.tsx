import { ViewTransition } from 'react';

import { useTranslations } from 'next-intl';

import { TextPath } from '@/components/ui/text-path';
import { cn } from '@/libs/utils/cn';

import { Spinner } from '../ui/spinner';

interface Props {
	className?: string;
	title?: string;
	spinnerOnly?: boolean;
}

export const AppLoading = (props: Props) => {
	const t = useTranslations();
	return (
		<ViewTransition>
			<div className={cn('flex flex-col justify-center items-center h-full w-full gap-3', props.className)}>
				{!props.spinnerOnly && (
					<span className="w-full max-w-[300px]">
						<TextPath
							text={props.title || t('meta.title')}
							svgProps={{
								viewBox: '0 0 600 100',
							}}
						/>
					</span>
				)}
				<Spinner aria-label="Loading..." />
			</div>
		</ViewTransition>
	);
};
