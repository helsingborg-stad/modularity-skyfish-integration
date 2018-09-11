<?php

/**
 * Plugin Name:       Skyfish Integration
 * Plugin URI:        https://github.com/helsingborg-stad/skyfish-integration
 * Description:       Skyfish integration for Wordpress
 * Version:           1.0.0
 * Author:            Nikolas Ramstedt (nikolas.ramstedt@helsingborg.se)
 * Author URI:        https://github.com/helsingborg-stad
 * License:           MIT
 * License URI:       https://opensource.org/licenses/MIT
 * Text Domain:       skyfish-integration
 * Domain Path:       /languages
 */

 // Protect agains direct file access
if (! defined('WPINC')) {
    die;
}

define('SKYFISHINTEGRATION_PATH', plugin_dir_path(__FILE__));
define('SKYFISHINTEGRATION_URL', plugins_url('', __FILE__));
define('SKYFISHINTEGRATION_TEMPLATE_PATH', SKYFISHINTEGRATION_PATH . 'templates/');

load_plugin_textdomain('skyfish-integration', false, plugin_basename(dirname(__FILE__)) . '/languages');

require_once SKYFISHINTEGRATION_PATH . 'source/php/Vendor/Psr4ClassLoader.php';
require_once SKYFISHINTEGRATION_PATH . 'Public.php';

// Instantiate and register the autoloader
$loader = new SkyfishIntegration\Vendor\Psr4ClassLoader();
$loader->addPrefix('SkyfishIntegration', SKYFISHINTEGRATION_PATH);
$loader->addPrefix('SkyfishIntegration', SKYFISHINTEGRATION_PATH . 'source/php/');
$loader->register();

// Start application
new SkyfishIntegration\App();
