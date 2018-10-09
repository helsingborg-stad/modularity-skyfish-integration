<?php

namespace SkyfishIntegration\Admin;

class AuthPage
{
    public static $adminPageName = 'Skyfish API authentication';
    public static $encryptionKey = 'skyfishIntegration';
    public static $authFormFields = array(
            [
                'id' => 'skyfish_login',
                'label' => 'Skyfish Login',
            ],
            [
                'id' => 'skyfish_password',
                'label' => 'Skyfish Password',
            ],
            [
                'id' => 'api_key',
                'label' => 'API Key',
            ],
            [
                'id' => 'api_secret',
                'label' => 'API Secret',
            ]
    );
    public static $sensetiveAuthFormFields = ['skyfish_password','api_secret'];

    public function __construct()
    {
        add_action('admin_menu', array($this, 'setupAdminPage'));
        add_action('admin_enqueue_scripts', array($this, 'enqueueReactAuthForm'), 10);
        add_action('wp_ajax_skyfishAuthenticateClient', array($this, 'skyfishAuthenticateClient'));
        add_action('wp_ajax_skyfishRemoveClient', array($this, 'skyfishRemoveClient'));
    }

    public function setupAdminPage()
    {
        add_options_page(
            self::$adminPageName,
            self::$adminPageName,
            'manage_options',
            sanitize_title(self::$adminPageName),
            array($this, 'renderReactWrapper')
        );
    }

    public function renderReactWrapper()
    {
        $output = '';
        $output .= '<div class="wrap">';
        $output .= '<h1>' . self::$adminPageName . '</h1>';
        $output .= '<div id="root"></div>';
        $output .= '</div>';


        echo $output;
    }

    public function enqueueReactAuthForm()
    {
        if (!self::isAuthenticationPage()) {
            return;
        }

        //Enque react & react-dom
        \SkyfishIntegration\Helper\React::enqueue();

        wp_enqueue_script('skyfish-integration-admin-js', '', [], null, true);
        wp_localize_script('skyfish-integration-admin-js', 'skyfishAdminData', $this->skyfishAdminDataController());
    }


    public function skyfishAdminDataController()
    {
        $data = array(
            'nonce' => wp_create_nonce(sanitize_title(self::$adminPageName)),
            'fields' => self::getAuthFormFields(),
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'authenticated' => (get_option('skyfish_authorised') && get_option('skyfish_authorised') == true ? true : false)
        );

        return $data;
    }

    public static function getAuthFormFields()
    {
        //Already authorized
        if (get_option('skyfish_authorised') && get_option('skyfish_authorised') == true) {
            //Get values from DB
            $credentials = get_option('skyfish_credentials');

            //Exclude sensitive fields
            $fields = array_filter(self::$authFormFields, function($field) {
                return !in_array($field['id'], self::$sensetiveAuthFormFields);
            });

            return array_map(function($field) use ($credentials) {
                //Make labels translatable
                if (isset($field['label']) && is_string($field['label']) && !empty($field['label'])) {
                    $field['label'] = __($field['label']);
                }
                //Append field values from DB and set to read-only
                if (isset($credentials[$field['id']])) {
                    $field['value'] = $credentials[$field['id']];
                    $field['readOnly'] = true;
                }
                return $field;
            }, $fields);
        }

        //Not authorized
        return array_map(function($field) {
            //Make labels translatable
            if (isset($field['label']) && is_string($field['label']) && !empty($field['label'])) {
                $field['label'] = __($field['label']);
            }
            return $field;
        }, self::$authFormFields);
    }


    public function skyfishAuthenticateClient()
    {
        if (!defined('DOING_AJAX') || !DOING_AJAX) {
            return false;
            die;
        }

        if (!wp_verify_nonce($_POST['nonce'], sanitize_title(self::$adminPageName))) {
            die('Busted!');
        }

        if (!isset($_POST['fields']) || !is_array($_POST['fields']) || empty($_POST['fields'])) {
            return false;
            die;
        }

        $fieldsToUse = [
            'skyfish_login',
            'skyfish_password',
            'api_key',
            'api_secret'
        ];

        $credentials = array();
        foreach ($_POST['fields'] as $field) {
            if (in_array($field['id'], $fieldsToUse)) {
                $credentials[$field['id']] = $field['value'];
            }
        }

        $api = new \SkyfishIntegration\Api();
        $api->login = $credentials['skyfish_login'];
        $api->password = $credentials['skyfish_password'];
        $api->key = $credentials['api_key'];
        $api->secret = $credentials['api_secret'];
        $api->token = $api->generateToken();

        //Failed to generate token
        if (!$api->token) {
            return;
            die;
        }

        //Encrypt sensetive data before saving to DB
        array_walk($credentials, function(&$field, $fieldKey) {
            if (in_array($fieldKey, self::$sensetiveAuthFormFields)) {
                $field = self::encryptDecrypt('encrypt', $field);
            }
        });

        update_option('skyfish_authorised', true);
        update_option('skyfish_credentials', $credentials);

        echo json_encode([
            'fields' => self::getAuthFormFields(),
            'authenticated' => get_option('skyfish_authorised')]
        );

        die;
    }

    public function skyfishRemoveClient()
    {
        if (!defined('DOING_AJAX') || !DOING_AJAX) {
            return false;
            die;
        }

        if (!wp_verify_nonce($_POST['nonce'], sanitize_title(self::$adminPageName))) {
            die('Busted!');
        }

        delete_transient('skyfishToken');
        delete_option('skyfish_credentials');
        update_option('skyfish_authorised', false);

        echo json_encode([
            'fields' => self::getAuthFormFields(),
            'authenticated' => get_option('skyfish_authorised')
        ]);

        die;
    }

    public static function isAuthenticationPage()
    {
        if (!is_admin()) {
            return false;
        }

        if (!isset($_GET['page']) || $_GET['page'] !== sanitize_title(self::$adminPageName)) {
            return false;
        }

        return true;
    }

    public static function encrypt($string)
    {
        return self::encryptDecrypt('encrypt', $string);
    }

    public static function decrypt($string)
    {
        return self::encryptDecrypt('decrypt', $string);
    }

    public static function encryptDecrypt($action, $string) {
        $output = false;
        $encrypt_method = "AES-256-CBC";
        $secret_key = self::$encryptionKey;
        $secret_iv = self::$encryptionKey;
        // hash
        $key = hash('sha256', $secret_key);

        // iv - encrypt method AES-256-CBC expects 16 bytes - else you will get a warning
        $iv = substr(hash('sha256', $secret_iv), 0, 16);
        if ($action == 'encrypt') {
            $output = openssl_encrypt($string, $encrypt_method, $key, 0, $iv);
            $output = base64_encode($output);
        } else if($action == 'decrypt') {
            $output = openssl_decrypt(base64_decode($string), $encrypt_method, $key, 0, $iv);
        }
        return $output;
    }
}
