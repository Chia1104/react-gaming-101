import { useEffect, useState, useRef, useCallback } from 'react';

import { usePathname, useRouter } from 'next/navigation';

interface Options {
	shouldBlock?: boolean;
	allowedRoutes?: string[];
	onBeforeUnload?: (event: BeforeUnloadEvent) => void;
	onProceedNavigation?: () => void;
	onCancelNavigation?: () => void;
}

export const useBlockNavigation = (options?: Options) => {
	const { shouldBlock = true, allowedRoutes, onBeforeUnload, onProceedNavigation, onCancelNavigation } = options ?? {};
	const router = useRouter();
	const pathname = usePathname();
	const [isAttemptingNavigation, setIsAttemptingNavigation] = useState(false);
	const [nextRoute, setNextRoute] = useState<string | null>(null);
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const originalPushRef = useRef(router.push);
	const lastLocationRef = useRef<string | null>(null);

	const canNavigate = useCallback(
		(url: string) => {
			const { pathname: urlPathname } = new URL(url, window.location.origin);
			if (!allowedRoutes) {
				return urlPathname === pathname;
			}
			return allowedRoutes.some(route => urlPathname === route || urlPathname.startsWith(route + '/'));
		},
		[allowedRoutes, pathname],
	);

	const proceedNavigation = useCallback(() => {
		if (nextRoute) {
			setIsAttemptingNavigation(false);
			originalPushRef.current(nextRoute);
			setNextRoute(null);
			onProceedNavigation?.();
		}
	}, [nextRoute, onProceedNavigation]);

	const cancelNavigation = useCallback(() => {
		setIsAttemptingNavigation(false);
		setNextRoute(null);
		onCancelNavigation?.();
	}, [onCancelNavigation]);

	useEffect(() => {
		const pushFn = originalPushRef.current;

		if (!shouldBlock) {
			// TODO: Fix legacy code
			// eslint-disable-next-line react-hooks/immutability
			router.push = pushFn;
			return;
		}

		const handleNavigation = (url: string) => {
			if (!shouldBlock || canNavigate(url) || url === pathname) {
				pushFn(url);
				return;
			}
			setIsAttemptingNavigation(true);
			setNextRoute(url);
		};
		router.push = ((url, _options) => {
			handleNavigation(url);
		}) as typeof router.push;
		return () => {
			router.push = pushFn;
		};
	}, [shouldBlock, pathname, router, canNavigate]);

	useEffect(() => {
		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			if (shouldBlock) {
				event.preventDefault();
				// event.returnValue = 'Are you sure you want to leave?';
				onBeforeUnload?.(event);
			}
		};
		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, [shouldBlock, onBeforeUnload]);

	useEffect(() => {
		if (!shouldBlock) return;

		const handleBackButton = (event: PopStateEvent) => {
			if (shouldBlock) {
				event.preventDefault();
				const previousURL = lastLocationRef.current || document.referrer || '/';
				setIsAttemptingNavigation(true);
				setNextRoute(previousURL);
				history.pushState(null, '', window.location.href);
			}
		};
		lastLocationRef.current = pathname;
		history.pushState(null, '', window.location.href);
		window.addEventListener('popstate', handleBackButton);
		return () => {
			window.removeEventListener('popstate', handleBackButton);
		};
	}, [shouldBlock, pathname]);

	return { isAttemptingNavigation, proceedNavigation, cancelNavigation, setIsAttemptingNavigation };
};
