import { createRoute } from "honox/factory";
import Counter from "@/islands/counter";

export default createRoute((c) => {
	return c.render(
		<>
			<title>User Auth Example</title>
			<h1>Hello, Developer!</h1>
			<Counter />
		</>,
	);
});
