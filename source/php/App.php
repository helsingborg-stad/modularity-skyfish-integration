<?php

namespace SkyfishIntegration;

class App
{
    public function __construct()
    {
        add_action('wp_enqueue_scripts', array($this, 'registerFrontendAssets'), 5);
        add_action('admin_enqueue_scripts', array($this, 'registerAdminAssets'), 5);

        new \SkyfishIntegration\Admin\AuthPage();
        new \SkyfishIntegration\Admin\DynamicFields();
    }

    /**
     * Register required frontend scripts
     * @return void
     */
    public function registerFrontendAssets()
    {
        wp_register_script('skyfish-integration-js', SKYFISHINTEGRATION_URL . '/dist/' . \SkyfishIntegration\Helper\CacheBust::name('js/SkyfishIntegration.js'), array('jquery', 'react', 'react-dom'));

        wp_register_style('skyfish-integration-css', SKYFISHINTEGRATION_URL . '/dist/' . \SkyfishIntegration\Helper\CacheBust::name('css/skyfish-integration.css'));
    }

    /**
     * Register required admin scripts & styles
     * @return void
     */
    public function registerAdminAssets()
    {
        wp_register_script('skyfish-integration-admin-js', SKYFISHINTEGRATION_URL . '/dist/' . \SkyfishIntegration\Helper\CacheBust::name('js/SkyfishIntegrationAdmin.js'), array('jquery', 'react', 'react-dom'));

        wp_register_style('skyfish-integration-admin.css', SKYFISHINTEGRATION_URL . '/dist/' . \SkyfishIntegration\Helper\CacheBust::name('css/skyfish-integration-admin.css'));
    }
}
