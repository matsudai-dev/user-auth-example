import { createRoute } from "honox/factory";
import Checkbox from "@/islands/checkbox";
import FloatingThemeToggle from "@/islands/floating-theme-toggle";

export default createRoute((c) => {
	return c.render(
		<>
			<title>Checkbox Examples | User Auth Example</title>
			<FloatingThemeToggle />
			<div class="min-h-screen py-12 px-4">
				<div class="max-w-2xl mx-auto space-y-12">
					<div>
						<h1 class="text-3xl font-bold text-center mb-2">
							Checkbox Component Examples
						</h1>
						<p class="text-center text-neutral-600 dark:text-neutral-400">
							All color variants and states
						</p>
					</div>

					<div class="space-y-8">
						<section>
							<h2 class="text-xl font-semibold mb-4">Default Color</h2>
							<div class="space-y-4 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
								<Checkbox id="default-1">Unchecked</Checkbox>
								<Checkbox id="default-2" defaultChecked>
									Checked
								</Checkbox>
								<Checkbox id="default-3" disabled>
									Disabled Unchecked
								</Checkbox>
								<Checkbox id="default-4" defaultChecked disabled>
									Disabled Checked
								</Checkbox>
							</div>
						</section>

						<section>
							<h2 class="text-xl font-semibold mb-4">
								Primary Color (Emerald)
							</h2>
							<div class="space-y-4 p-6 rounded-lg border border-emerald-200 dark:border-emerald-800">
								<Checkbox id="primary-1" color="primary">
									Unchecked
								</Checkbox>
								<Checkbox id="primary-2" color="primary" defaultChecked>
									Checked
								</Checkbox>
								<Checkbox id="primary-3" color="primary" disabled>
									Disabled Unchecked
								</Checkbox>
								<Checkbox
									id="primary-4"
									color="primary"
									defaultChecked
									disabled
								>
									Disabled Checked
								</Checkbox>
							</div>
						</section>

						<section>
							<h2 class="text-xl font-semibold mb-4">
								Secondary Color (Fuchsia)
							</h2>
							<div class="space-y-4 p-6 rounded-lg border border-fuchsia-200 dark:border-fuchsia-800">
								<Checkbox id="secondary-1" color="secondary">
									Unchecked
								</Checkbox>
								<Checkbox id="secondary-2" color="secondary" defaultChecked>
									Checked
								</Checkbox>
								<Checkbox id="secondary-3" color="secondary" disabled>
									Disabled Unchecked
								</Checkbox>
								<Checkbox
									id="secondary-4"
									color="secondary"
									defaultChecked
									disabled
								>
									Disabled Checked
								</Checkbox>
							</div>
						</section>

						<section>
							<h2 class="text-xl font-semibold mb-4">Danger Color (Red)</h2>
							<div class="space-y-4 p-6 rounded-lg border border-red-200 dark:border-red-800">
								<Checkbox id="danger-1" color="danger">
									Unchecked
								</Checkbox>
								<Checkbox id="danger-2" color="danger" defaultChecked>
									Checked
								</Checkbox>
								<Checkbox id="danger-3" color="danger" disabled>
									Disabled Unchecked
								</Checkbox>
								<Checkbox id="danger-4" color="danger" defaultChecked disabled>
									Disabled Checked
								</Checkbox>
							</div>
						</section>

						<section>
							<h2 class="text-xl font-semibold mb-4">Without Labels</h2>
							<div class="flex items-center gap-6 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
								<Checkbox id="no-label-1" />
								<Checkbox id="no-label-2" color="primary" defaultChecked />
								<Checkbox id="no-label-3" color="secondary" />
								<Checkbox id="no-label-4" color="danger" defaultChecked />
							</div>
						</section>

						<section>
							<h2 class="text-xl font-semibold mb-4">All Colors Comparison</h2>
							<div class="space-y-4 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
								<Checkbox id="compare-default" defaultChecked>
									Default
								</Checkbox>
								<Checkbox id="compare-primary" color="primary" defaultChecked>
									Primary
								</Checkbox>
								<Checkbox
									id="compare-secondary"
									color="secondary"
									defaultChecked
								>
									Secondary
								</Checkbox>
								<Checkbox id="compare-danger" color="danger" defaultChecked>
									Danger
								</Checkbox>
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
