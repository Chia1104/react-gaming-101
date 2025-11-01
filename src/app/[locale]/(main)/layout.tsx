import { Footer } from '@/components/commons/footer';
import { NavBar } from '@/components/commons/nav-bar';

const Layout = ({ children }: LayoutProps<'/[locale]'>) => {
	return (
		<>
			<NavBar className="fixed top-5 left-5 right-5 z-50 max-w-lg mx-auto" />
			<main className="mt-30 container mx-auto flex flex-col items-center justify-center p-2 min-h-[calc(100vh-120px)] pb-20">
				{children}
			</main>
			<Footer />
		</>
	);
};

export default Layout;
