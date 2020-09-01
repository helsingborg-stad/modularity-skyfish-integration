<?php

namespace SkyfishIntegration;

class App
{
    public function __construct()
    {
        add_action('wp_enqueue_scripts', array($this, 'registerFrontendAssets'), 5);
        add_action('admin_enqueue_scripts', array($this, 'registerAdminAssets'), 5);

        register_deactivation_hook( __FILE__, 'flush_rewrite_rules' );
        register_activation_hook( __FILE__, 'flushRewrites' );

        add_action( 'init', array($this, 'rewriteEndpoint'));

        new \SkyfishIntegration\Admin\AuthPage();
        new \SkyfishIntegration\Admin\DynamicFields();

    }

    /**
     * Register required frontend scripts
     * @return void
     */
    public function registerFrontendAssets()
    {
        wp_register_script('skyfish-integration-js', SKYFISHINTEGRATION_URL . '/dist/' . \SkyfishIntegration\Helper\CacheBust::name('js/SkyfishIntegration.min.js'), array('jquery', 'react', 'react-dom'), false, true);
        wp_register_style('skyfish-integration-css', SKYFISHINTEGRATION_URL . '/dist/' . \SkyfishIntegration\Helper\CacheBust::name('css/skyfish-integration.min.css'));
    }

    /**
     * Register required admin scripts & styles
     * @return void
     */
    public function registerAdminAssets()
    {
        wp_register_script('skyfish-integration-admin-js', SKYFISHINTEGRATION_URL . '/dist/' . \SkyfishIntegration\Helper\CacheBust::name('js/SkyfishIntegrationAdmin.min.js'), array('jquery', 'react', 'react-dom'));
        wp_register_style('skyfish-integration-admin.css', SKYFISHINTEGRATION_URL . '/dist/' . \SkyfishIntegration\Helper\CacheBust::name('css/skyfish-integration-admin.min.css'));
    }

    /**
     * Flush permalinks
     * @return void
     */
    function flushRewrites() {
        flush_rewrite_rules();
    }

    /**
     * Adding new endpoints for skyfish id
     * @return void
     */
    public function rewriteEndpoint (){
        add_rewrite_endpoint( 'skyfishId', EP_ALL );
        flush_rewrite_rules();
    }
}

