import { createRoute } from "honox/factory";
import Button from "@/islands/button";
import FloatingThemeToggle from "@/islands/floating-theme-toggle";

export default createRoute((c) => {
	return c.render(
		<>
			<title>Button Examples | User Auth Example</title>
			<FloatingThemeToggle />
			<div class="min-h-screen py-12 px-4">
				<div class="max-w-2xl mx-auto space-y-12">
					<div>
						<h1 class="text-3xl font-bold text-center mb-2">
							Button Component Examples
						</h1>
						<p class="text-center text-neutral-600 dark:text-neutral-400">
							All color variants and states
						</p>
					</div>

					<div class="space-y-8">
						<section>
							<h2 class="text-xl font-semibold mb-4">Default Color</h2>
							<div class="space-y-4 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
								<div class="flex items-center gap-4">
									<Button id="default-1">Default Button</Button>
									<Button id="default-2" disabled>
										Disabled
									</Button>
								</div>
							</div>
						</section>

						<section>
							<h2 class="text-xl font-semibold mb-4">
								Primary Color (Emerald)
							</h2>
							<div class="space-y-4 p-6 rounded-lg border border-emerald-200 dark:border-emerald-800">
								<div class="flex items-center gap-4">
									<Button id="primary-1" color="primary">
										Primary Button
									</Button>
									<Button id="primary-2" color="primary" disabled>
										Disabled
									</Button>
								</div>
							</div>
						</section>

						<section>
							<h2 class="text-xl font-semibold mb-4">
								Secondary Color (Fuchsia)
							</h2>
							<div class="space-y-4 p-6 rounded-lg border border-fuchsia-200 dark:border-fuchsia-800">
								<div class="flex items-center gap-4">
									<Button id="secondary-1" color="secondary">
										Secondary Button
									</Button>
									<Button id="secondary-2" color="secondary" disabled>
										Disabled
									</Button>
								</div>
							</div>
						</section>

						<section>
							<h2 class="text-xl font-semibold mb-4">Danger Color (Red)</h2>
							<div class="space-y-4 p-6 rounded-lg border border-red-200 dark:border-red-800">
								<div class="flex items-center gap-4">
									<Button id="danger-1" color="danger">
										Danger Button
									</Button>
									<Button id="danger-2" color="danger" disabled>
										Disabled
									</Button>
								</div>
							</div>
						</section>

						<section>
							<h2 class="text-xl font-semibold mb-4">Button Types</h2>
							<div class="space-y-4 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
								<div class="flex items-center gap-4 flex-wrap">
									<Button id="type-button" type="button" color="primary">
										type="button"
									</Button>
									<Button id="type-submit" type="submit" color="secondary">
										type="submit"
									</Button>
									<Button id="type-reset" type="reset" color="danger">
										type="reset"
									</Button>
								</div>
							</div>
						</section>

						<section>
							<h2 class="text-xl font-semibold mb-4">Full Width</h2>
							<div class="space-y-4 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
								<Button id="fullwidth-1" color="primary" fullWidth>
									Full Width Primary
								</Button>
								<Button id="fullwidth-2" color="secondary" fullWidth>
									Full Width Secondary
								</Button>
								<Button id="fullwidth-3" color="danger" fullWidth disabled>
									Full Width Disabled
								</Button>
							</div>
						</section>

						<section>
							<h2 class="text-xl font-semibold mb-4">All Colors Comparison</h2>
							<div class="space-y-4 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
								<div class="flex items-center gap-4 flex-wrap">
									<Button id="compare-default">Default</Button>
									<Button id="compare-primary" color="primary">
										Primary
									</Button>
									<Button id="compare-secondary" color="secondary">
										Secondary
									</Button>
									<Button id="compare-danger" color="danger">
										Danger
									</Button>
								</div>
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
