<?php

namespace SkyfishIntegration\Admin;

class Authentication
{
    public static $optionsPageName = 'Skyfish Authentication';

    public function __construct()
    {
        add_action('admin_enqueue_scripts', array($this, 'authenticationScript'), 10);
        add_action( 'admin_menu', array($this, 'setupOptionsPage'));
    }

    public function authenticationScript()
    {
        if (!self::isAuthenticationPage()) {
            return;
        }


    }

    public function setupOptionsPage()
    {
        add_options_page(
            self::$optionsPageName,
            self::$optionsPageName,
            'manage_options',
            sanitize_title(self::$optionsPageName),
            array($this, 'renderOptionsPage')
        );
    }

    public function renderOptionsPage()
    {
        echo '<div class="wrap"><h1>' . self::$optionsPageName . '</h1><div id="js-skyfish-authentication"></div></div>';
    }

    public static function isAuthenticationPage()
    {
        if (!is_admin()) {
            return false;
        }

        if (!isset($_GET['page']) || $_GET['page'] !== sanitize_title(self::$optionsPageName)) {
            return false;
        }

        return true;
    }
}
