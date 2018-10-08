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

// Acf auto import and export
add_action('plugins_loaded', function () {
    $acfExportManager = new \AcfExportManager\AcfExportManager();
    $acfExportManager->setTextdomain('skyfish-integration');
    $acfExportManager->setExportFolder(SKYFISHINTEGRATION_PATH . 'acf-fields/');
    $acfExportManager->autoExport(array(
        'skyfish-integration' => 'group_5bba400a04b6c',
    ));
    $acfExportManager->import();
});

//Registers the module
add_action('plugins_loaded', function () {
    if (function_exists('modularity_register_module')) {
        modularity_register_module(
            SKYFISHINTEGRATION_PATH . 'Source/php/Module/',
            'Skyfish'
        );
    }
});

// Add module template dir
add_filter('Modularity/Module/TemplatePath', function ($paths) {
    $paths[] = SKYFISHINTEGRATION_PATH . 'Source/php/Module/views/';
    return $paths;
});
