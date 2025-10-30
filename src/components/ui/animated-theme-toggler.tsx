import { useCallback, useRef } from 'react';

import { Moon, Sun } from 'lucide-react';
import { flushSync } from 'react-dom';

import { Theme } from '@/enums/theme.enum';
import useDarkMode from '@/hooks/useDarkMode';
import { cn } from '@/libs/utils/cn';

import { Button } from './button';

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<'button'> {
	duration?: number;
}

export const AnimatedThemeToggler = ({ className, duration = 400, ...props }: AnimatedThemeTogglerProps) => {
	const { isDarkMode, setTheme } = useDarkMode();
	const buttonRef = useRef<HTMLButtonElement>(null);

	const toggleTheme = useCallback(async () => {
		if (!buttonRef.current) return;

		if (!document.startViewTransition) {
			setTheme(isDarkMode ? Theme.Light : Theme.Dark);
			return;
		}

		await document.startViewTransition(() => {
			flushSync(() => {
				setTheme(isDarkMode ? Theme.Light : Theme.Dark);
			});
		}).ready;

		const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
		const x = left + width / 2;
		const y = top + height / 2;
		const maxRadius = Math.hypot(Math.max(left, window.innerWidth - left), Math.max(top, window.innerHeight - top));

		document.documentElement.animate(
			{
				clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`],
			},
			{
				duration,
				easing: 'ease-in-out',
				pseudoElement: '::view-transition-new(root)',
			},
		);
	}, [duration, isDarkMode, setTheme]);

	return (
		<Button variant="ghost" size="icon" ref={buttonRef} onClick={toggleTheme} className={cn(className)} {...props}>
			{isDarkMode ? <Sun strokeWidth={1} className="size-6" /> : <Moon strokeWidth={1} className="size-6" />}
		</Button>
	);
};
