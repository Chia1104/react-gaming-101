import type { ReactNode, FC, ComponentPropsWithoutRef } from 'react';

import { Theme } from '@/enums/theme.enum';
import { cn } from '@/libs/utils/cn';

interface Props {
	children: ReactNode;
	locale?: Locale;
	htmlProps?: ComponentPropsWithoutRef<'html'>;
	bodyProps?: ComponentPropsWithoutRef<'body'>;
	theme?: Theme;
}

const AppLayout: FC<Props> = ({ children, locale, htmlProps, bodyProps, theme }) => {
	const themeSchema = theme ? (theme === Theme.Dark ? Theme.Dark : Theme.Light) : undefined;
	return (
		<html
			lang={locale}
			suppressHydrationWarning
			{...htmlProps}
			className={cn(htmlProps?.className, themeSchema)}
			style={{
				colorScheme: themeSchema,
				...htmlProps?.style,
			}}
		>
			<body {...bodyProps} className={cn(bodyProps?.className)}>
				{children}
			</body>
		</html>
	);
};

export default AppLayout;
