/**
 * Generates a login page URL with an optional redirect parameter.
 * If the current path is root ("/"), returns "/login" without redirect.
 * Otherwise, appends the current path as a redirect query parameter.
 *
 * @param currentPath - The current page path to redirect back to after login
 * @returns The login URL with redirect parameter if applicable
 *
 * @example
 * getLoginRedirectUrl("/")           // "/login"
 * getLoginRedirectUrl("/dashboard")  // "/login?redirect=%2Fdashboard"
 */
export const getLoginRedirectUrl = (currentPath: string): string => {
	return currentPath === "/"
		? "/login"
		: `/login?redirect=${encodeURIComponent(currentPath)}`;
};
