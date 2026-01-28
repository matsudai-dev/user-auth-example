import type { FC } from "hono/jsx";

interface Props {
	resetUrl: string;
}

export const PasswordResetEmail: FC<Props> = ({ resetUrl }) => (
	<>
		<p>以下のリンクをクリックして、パスワードをリセットしてください：</p>
		<p>
			<a href={resetUrl}>{resetUrl}</a>
		</p>
	</>
);
