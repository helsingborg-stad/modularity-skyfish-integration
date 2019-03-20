import AuthForm from "./Admin/AuthForm.js";

class App {
	constructor() {
		if (typeof skyfishAdminData != "undefined") {
			this.renderAuthForm();
		}
	}

	renderAuthForm() {
		const element = document.getElementById("root");
		if (element == null) {
			return;
		}

		ReactDOM.render(<AuthForm />, element);
	}
}

new App();
