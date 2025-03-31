import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { SessionProviderWrapper } from "@/components/providers/SessionProvider";
import Head from "next/head";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata = {
	title: "Travnicek artists app",
	description:
		"Search and discover music artists and tracks based on your preferences",
	keywords: "music, spotify, artists, tracks, discovery",
	openGraph: {
		title: "Travnicek artists app",
		description:
			"Search and discover music artists and tracks based on your preferences",
		type: "website",
		locale: "en_US",
		url: "https://rop.cz",
	},
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<Head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="theme-color" content="#000000" />
				<link rel="icon" href="/favicon.ico" />
				<link rel="apple-touch-icon" href="/logo192.png" />
				<title>{metadata.title}</title>
				<meta name="description" content={metadata.description} />
				<meta name="keywords" content={metadata.keywords} />
				<meta property="og:title" content={metadata.openGraph.title} />
				<meta
					property="og:description"
					content={metadata.openGraph.description}
				/>
				<meta property="og:type" content={metadata.openGraph.type} />
				<meta property="og:locale" content={metadata.openGraph.locale} />
				<meta property="og:url" content={metadata.openGraph.url} />
			</Head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<header className="border-b border-gray-200 bg-white shadow-sm">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<nav className="flex h-16 items-center justify-between">
							<div className="flex-shrink-0">
								<h1 className="text-xl font-semibold text-gray-900">
									Music Explorer
								</h1>
							</div>
							<div className="flex items-center space-x-4">
								<NavButton href="/dashboard">Dashboard</NavButton>
								<NavButton href="/search-artist">Search Artist</NavButton>
							</div>
						</nav>
					</div>
				</header>
				<main>
					<SessionProviderWrapper>{children}</SessionProviderWrapper>
				</main>
			</body>
		</html>
	);
}

function NavButton({ href, children }) {
	return (
		<Link
			href={href}
			className="flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
		>
			{children}
		</Link>
	);
}
