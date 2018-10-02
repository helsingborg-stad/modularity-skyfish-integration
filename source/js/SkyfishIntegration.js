'use strict';

const SkyfishApi = require('./Api/SkyfishParser.js');
const SkyfishModuleContainer = require('./Module/SkyfishModule.jsx');

const App = class {
    constructor()
    {
        this.skyfishModuleId = 'skyfish-module';
        this.renderModule();
    }

    renderModule()
    {
        const domElement = document.getElementById(this.skyfishModuleId);

        if (typeof(skyfishData) == 'undefined' || domElement == null) {
            return;
        }

        const api = new SkyfishApi(skyfishData.authToken, skyfishData.baseUrl);

        if (!api.authToken) {
            return;
        }

        ReactDOM.render(
            <SkyfishModuleContainer
                api={api}
            />,
            domElement
        );
    }

};

new App();
