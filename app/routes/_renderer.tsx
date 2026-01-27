import { jsxRenderer } from "hono/jsx-renderer";
import { Link, Script } from "honox/server";

const themeScript = `
(function() {
	const theme = localStorage.getItem('theme') || 
		(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
	if (theme === 'dark') {
		document.documentElement.classList.add('dark');
	}
})();
`;

export default jsxRenderer(({ children }) => {
	return (
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link rel="icon" href="/favicon.ico" />
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
				<Link href="/app/style.css" rel="stylesheet" />
				<Script src="/app/client.ts" async />
			</head>
			<body>{children}</body>
		</html>
	);
});
