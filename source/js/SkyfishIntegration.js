import SkyfishApi from "./Api/SkyfishParser.js";
import SkyfishModule from "./Module/SkyfishModule.js";

const App = class {
	constructor() {
		this.renderModule();
	}

	renderModule() {
		const domElement = document.getElementById("skyfish-module");

		if (
			typeof skyfishAjaxObject == "undefined" ||
			domElement == null ||
			typeof skyfishAjaxObject.apiSettings == "undefined"
		) {
			return;
		}

		const api = new SkyfishApi(skyfishAjaxObject.apiSettings);

		if (!api.authToken) {
			return;
		}

		ReactDOM.render(<SkyfishModule api={api} />, domElement);
	}
};

new App();
