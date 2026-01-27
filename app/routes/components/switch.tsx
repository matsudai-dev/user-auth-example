import { createRoute } from "honox/factory";
import { Switch } from "@/components/switch";

export default createRoute((c) => {
	return c.render(
		<>
			<title>Switch Examples | User Auth Example</title>
			<div class="min-h-screen py-12 px-4">
				<div class="max-w-2xl mx-auto space-y-12">
					<div>
						<h1 class="text-3xl font-bold text-center mb-2">
							Switch Component Examples
						</h1>
						<p class="text-center text-neutral-600 dark:text-neutral-400">
							iOS-style toggle switches with all color variants
						</p>
					</div>

					<div class="space-y-8">
						<section>
							<h2 class="text-xl font-semibold mb-4">Default Color</h2>
							<div class="space-y-4 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
								<div class="flex items-center justify-between">
									<span class="text-sm">Off State</span>
									<Switch id="default-off" checked={false} />
								</div>
								<div class="flex items-center justify-between">
									<span class="text-sm">On State</span>
									<Switch id="default-on" checked={true} />
								</div>
								<div class="flex items-center justify-between">
									<span class="text-sm">With Label</span>
									<Switch
										id="default-label"
										label="Enable notifications"
										checked={true}
									/>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-sm">Disabled Off</span>
									<Switch id="default-disabled-off" checked={false} disabled />
								</div>
								<div class="flex items-center justify-between">
									<span class="text-sm">Disabled On</span>
									<Switch id="default-disabled-on" checked={true} disabled />
								</div>
							</div>
						</section>

						<section>
							<h2 class="text-xl font-semibold mb-4">
								Primary Color (Emerald)
							</h2>
							<div class="space-y-4 p-6 rounded-lg border border-emerald-200 dark:border-emerald-800">
								<div class="flex items-center justify-between">
									<span class="text-sm">Off State</span>
									<Switch id="primary-off" checked={false} color="primary" />
								</div>
								<div class="flex items-center justify-between">
									<span class="text-sm">On State</span>
									<Switch id="primary-on" checked={true} color="primary" />
								</div>
								<div class="flex items-center justify-between">
									<span class="text-sm">With Label</span>
									<Switch
										id="primary-label"
										label="Auto-save enabled"
										checked={true}
										color="primary"
									/>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-sm">Disabled Off</span>
									<Switch
										id="primary-disabled-off"
										checked={false}
										color="primary"
										disabled
									/>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-sm">Disabled On</span>
									<Switch
										id="primary-disabled-on"
										checked={true}
										color="primary"
										disabled
									/>
								</div>
							</div>
						</section>

						<section>
							<h2 class="text-xl font-semibold mb-4">
								Secondary Color (Fuchsia)
							</h2>
							<div class="space-y-4 p-6 rounded-lg border border-fuchsia-200 dark:border-fuchsia-800">
								<div class="flex items-center justify-between">
									<span class="text-sm">Off State</span>
									<Switch
										id="secondary-off"
										checked={false}
										color="secondary"
									/>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-sm">On State</span>
									<Switch id="secondary-on" checked={true} color="secondary" />
								</div>
								<div class="flex items-center justify-between">
									<span class="text-sm">With Label</span>
									<Switch
										id="secondary-label"
										label="Dark mode"
										checked={false}
										color="secondary"
									/>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-sm">Disabled Off</span>
									<Switch
										id="secondary-disabled-off"
										checked={false}
										color="secondary"
										disabled
									/>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-sm">Disabled On</span>
									<Switch
										id="secondary-disabled-on"
										checked={true}
										color="secondary"
										disabled
									/>
								</div>
							</div>
						</section>

						<section>
							<h2 class="text-xl font-semibold mb-4">Danger Color (Red)</h2>
							<div class="space-y-4 p-6 rounded-lg border border-red-200 dark:border-red-800">
								<div class="flex items-center justify-between">
									<span class="text-sm">Off State</span>
									<Switch id="danger-off" checked={false} color="danger" />
								</div>
								<div class="flex items-center justify-between">
									<span class="text-sm">On State</span>
									<Switch id="danger-on" checked={true} color="danger" />
								</div>
								<div class="flex items-center justify-between">
									<span class="text-sm">With Label</span>
									<Switch
										id="danger-label"
										label="Delete account permanently"
										checked={false}
										color="danger"
									/>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-sm">Disabled Off</span>
									<Switch
										id="danger-disabled-off"
										checked={false}
										color="danger"
										disabled
									/>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-sm">Disabled On</span>
									<Switch
										id="danger-disabled-on"
										checked={true}
										color="danger"
										disabled
									/>
								</div>
							</div>
						</section>

						<section>
							<h2 class="text-xl font-semibold mb-4">All Colors Comparison</h2>
							<div class="space-y-4 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
								<div class="flex items-center justify-between">
									<span class="text-sm">Default</span>
									<Switch id="compare-default" checked={true} />
								</div>
								<div class="flex items-center justify-between">
									<span class="text-sm">Primary</span>
									<Switch id="compare-primary" checked={true} color="primary" />
								</div>
								<div class="flex items-center justify-between">
									<span class="text-sm">Secondary</span>
									<Switch
										id="compare-secondary"
										checked={true}
										color="secondary"
									/>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-sm">Danger</span>
									<Switch id="compare-danger" checked={true} color="danger" />
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
