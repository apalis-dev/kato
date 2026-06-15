import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
	{ title: "Kato" },
	{
		name: "description",
		content: "Kato web app powered by React Router v7.",
	},
];

export default function Home() {
	return (
		<main className="min-h-screen bg-background text-foreground">
			<section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16">
				<p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
					Kato
				</p>
				<h1 className="mt-4 max-w-3xl text-4xl font-semibold sm:text-5xl">
					React Router v7 is ready.
				</h1>
				<p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
					The web app is configured for React Router framework mode with Vite,
					server rendering, route modules, metadata, and global styles.
				</p>
			</section>
		</main>
	);
}
