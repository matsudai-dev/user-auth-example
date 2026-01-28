import { createRoute } from "honox/factory";
import { TextInput } from "@/components/text-input";
import FloatingThemeToggle from "@/islands/floating-theme-toggle";

export default createRoute((c) => {
	return c.render(
		<>
			<title>TextInput Examples | User Auth Example</title>
			<FloatingThemeToggle />
			<div class="min-h-screen py-12 px-4">
				<div class="max-w-2xl mx-auto space-y-12">
					<div>
						<h1 class="text-3xl font-bold text-center mb-2">
							TextInput Component Examples
						</h1>
						<p class="text-center text-neutral-600 dark:text-neutral-400">
							All color variants and states
						</p>
					</div>

					<div class="space-y-8">
						<section>
							<h2 class="text-xl font-semibold mb-4">Default Color</h2>
							<div class="space-y-4 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
								<TextInput
									id="default-1"
									label="Email Address"
									type="email"
									placeholder="example@example.com"
								/>
								<TextInput
									id="default-2"
									label="Password"
									type="password"
									placeholder="Enter your password"
								/>
								<TextInput
									id="default-3"
									label="Disabled Field"
									type="text"
									value="This field is disabled"
									disabled
								/>
							</div>
						</section>

						<section>
							<h2 class="text-xl font-semibold mb-4">
								Primary Color (Emerald)
							</h2>
							<div class="space-y-4 p-6 rounded-lg border border-emerald-200 dark:border-emerald-800">
								<TextInput
									id="primary-1"
									label="Username"
									type="text"
									placeholder="Enter username"
									color="primary"
								/>
								<TextInput
									id="primary-2"
									label="Email"
									type="email"
									placeholder="user@example.com"
									color="primary"
								/>
								<TextInput
									id="primary-3"
									label="Disabled Primary"
									type="text"
									value="Disabled state"
									color="primary"
									disabled
								/>
							</div>
						</section>

						<section>
							<h2 class="text-xl font-semibold mb-4">
								Secondary Color (Fuchsia)
							</h2>
							<div class="space-y-4 p-6 rounded-lg border border-fuchsia-200 dark:border-fuchsia-800">
								<TextInput
									id="secondary-1"
									label="Display Name"
									type="text"
									placeholder="Your display name"
									color="secondary"
								/>
								<TextInput
									id="secondary-2"
									label="Bio"
									type="text"
									placeholder="Tell us about yourself"
									color="secondary"
								/>
								<TextInput
									id="secondary-3"
									label="Disabled Secondary"
									type="text"
									value="Disabled state"
									color="secondary"
									disabled
								/>
							</div>
						</section>

						<section>
							<h2 class="text-xl font-semibold mb-4">Danger Color (Red)</h2>
							<div class="space-y-4 p-6 rounded-lg border border-red-200 dark:border-red-800">
								<TextInput
									id="danger-1"
									label="Delete Confirmation"
									type="text"
									placeholder="Type 'DELETE' to confirm"
									color="danger"
								/>
								<TextInput
									id="danger-2"
									label="Critical Action"
									type="password"
									placeholder="Enter password to proceed"
									color="danger"
								/>
								<TextInput
									id="danger-3"
									label="Disabled Danger"
									type="text"
									value="Disabled state"
									color="danger"
									disabled
								/>
							</div>
						</section>

						<section>
							<h2 class="text-xl font-semibold mb-4">Without Labels</h2>
							<div class="space-y-4 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
								<TextInput
									id="no-label-1"
									type="text"
									placeholder="Default (no label)"
								/>
								<TextInput
									id="no-label-2"
									type="text"
									placeholder="Primary (no label)"
									color="primary"
								/>
								<TextInput
									id="no-label-3"
									type="text"
									placeholder="Secondary (no label)"
									color="secondary"
								/>
								<TextInput
									id="no-label-4"
									type="text"
									placeholder="Danger (no label)"
									color="danger"
								/>
							</div>
						</section>
					</div>

					<div class="text-center pt-8">
						<a
							href="/"
							class="text-blue-600 dark:text-blue-400 hover:underline"
						>
							← Back to Home
						</a>
					</div>
				</div>
			</div>
		</>,
	);
});
