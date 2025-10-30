'use client';

import { Copy, CheckCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useClipboard } from '@/hooks/useClipboard';
import { cn } from '@/libs/utils/cn';

interface Props extends Omit<React.ComponentProps<'button'>, 'onPress' | 'onCopy'> {
	content: string;
	timeout?: number;
	onCopy?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	iconProps?: React.ComponentPropsWithoutRef<'span'>;
}

export const CopyButton = ({ content, onCopy, timeout, iconProps, ...props }: Props) => {
	const { copy, copied } = useClipboard({ timeout });
	const t = useTranslations();
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					aria-label="copy"
					size="icon"
					variant="ghost"
					{...props}
					onClick={e => {
						copy(content);
						onCopy?.(e);
					}}
				>
					{copied ? (
						<CheckCheck className={cn('size-3 hover:text-primary', iconProps?.className)} strokeWidth={1} />
					) : (
						<Copy className={cn('size-3 hover:text-primary rotate-90', iconProps?.className)} strokeWidth={1} />
					)}
				</Button>
			</TooltipTrigger>
			<TooltipContent>{copied ? t('action.copied') : t('action.copy')}</TooltipContent>
		</Tooltip>
	);
};
