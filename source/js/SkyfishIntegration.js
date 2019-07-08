import SkyfishApi from './Api/SkyfishParser.js';
import SkyfishModule from './Module/SkyfishModule.js';

class App {
    constructor() {
        this.renderModule();
    }

    renderModule() {
        const domElement = document.getElementById('skyfish-module');

        if (
            typeof skyfishAjaxObject == 'undefined' ||
            domElement == null ||
            typeof skyfishAjaxObject.apiSettings == 'undefined'
        ) {
            return;
        }

        const api = new SkyfishApi(skyfishAjaxObject.apiSettings);

        if (!api.authToken) {
            return;
        }

        ReactDOM.render(
            <SkyfishModule api={api} errorFallback={skyfishAjaxObject.apiSettings.fallbackUrl} />,
            domElement
        );
    }
}

new App();
