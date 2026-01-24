import type { FC } from "hono/jsx";

interface Props {
	verifyUrl: string;
}

export const SignupVerificationEmail: FC<Props> = ({ verifyUrl }) => (
	<>
		<p>以下のリンクをクリックして、メールアドレスを確認してください：</p>
		<p>
			<a href={verifyUrl}>{verifyUrl}</a>
		</p>
	</>
);
