'use strict';

import AuthForm from './Admin/AuthForm.js';

const App = class {
    constructor()
    {
        if (typeof(skyfishAdminData) != 'undefined') {
            this.renderAuthForm();
        }
    }

    renderAuthForm()
    {
        const element = document.getElementById('root');
        if (element == null) {
            return;
        }

        ReactDOM.render(
            <AuthForm />,
            element
        );
    }
};

new App();



