'use strict';

import SkyfishApi from './Api/SkyfishParser.js';
import SkyfishModule from './Module/SkyfishModule.js';

const App = class {
    constructor()
    {
        this.renderModule();
    }

    renderModule()
    {
        const domElement = document.getElementById('skyfish-module');

        if (typeof(skyfishData) == 'undefined' || domElement == null) {
            return;
        }

        const api = new SkyfishApi(skyfishData.authToken, skyfishData.baseUrl, skyfishData.rootFolder || null);

        if (!api.authToken) {
            return;
        }

        ReactDOM.render(
            <SkyfishModule
                api={api}
            />,
            domElement
        );
    }

};


new App();
