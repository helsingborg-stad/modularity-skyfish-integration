import {WordpressAuthForm as AuthForm} from 'hbg-react';
const $ = jQuery.noConflict();
export default class extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            fields: skyfishAdminData.fields,
            authenticated: skyfishAdminData.authenticated ? true : false,
            notice: null,
            noticeType: null
        }
    }

    onSubmitForm(submittedFields)
    {
        let data = {
            nonce: skyfishAdminData.nonce,
            action: !this.state.authenticated ? 'skyfishAuthenticateClient' : 'skyfishRemoveClient',
            fields: !this.state.authenticated ? submittedFields : null
        };

        $.ajax({
            type : "post",
            url : skyfishAdminData.ajaxUrl,
            data : data,
            success : function(response, status) {
                let responseData = JSON.parse(response);
                if (typeof(responseData.authenticated != 'undefined') && typeof(responseData.fields) != 'undefined') {
                    this.setState((prevState, prevProps) => ({
                        fields: responseData.fields,
                        authenticated: responseData.authenticated ? true : false,
                        notice: responseData.authenticated ? 'Success!' : null,
                        noticeType: responseData.authenticated ? 'success' : null,
                    }));

                    return;
                }

                this.setState({
                    notice: 'Authorization failed, could not generate token. Please try again.',
                    noticeType: 'error'
                });

            }.bind(this),
            error : function(jqXHR, status, error) {
                this.setState({
                    notice: 'Request failed.',
                    noticeType: 'error'
                });
            }
        });
    }

    render()
    {
        const {fields, authenticated, notice, noticeType} = this.state;

        return (
            <AuthForm
                title={!authenticated ? 'API Authentication' : 'Client is authorized'}
                fields={fields}
                onSubmitAction={this.onSubmitForm.bind(this)}
                submitButtonText={authenticated ? 'Remove client' : 'Authenticate client'}
                submitButtonStyle={authenticated ? null : 'primary'}
                notice={notice}
                noticeType={noticeType}
            />
        );
    }
}
