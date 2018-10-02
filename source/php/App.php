<?php

namespace SkyfishIntegration;

class App
{
    public function __construct()
    {
        add_action('wp_enqueue_scripts', array($this, 'enqueueStyles'), 5);
        add_action('wp_enqueue_scripts', array($this, 'enqueueScripts'), 5);

        new \SkyfishIntegration\Admin\Authentication();
    }

    /**
     * Enqueue required style
     * @return void
     */
    public function enqueueStyles()
    {
        wp_register_style('skyfish-integration-css', SKYFISHINTEGRATION_URL . '/dist/' . \SkyfishIntegration\Helper\CacheBust::name('css/skyfish-integration.css'));
        wp_register_style('skyfish-integration-admin.css', SKYFISHINTEGRATION_URL . '/dist/' . \SkyfishIntegration\Helper\CacheBust::name('css/skyfish-integration-admin.css'));
    }

    /**
     * Enqueue required scripts
     * @return void
     */
    public function enqueueScripts()
    {
        wp_register_script('skyfish-integration-js', SKYFISHINTEGRATION_URL . '/dist/' . \SkyfishIntegration\Helper\CacheBust::name('js/SkyfishIntegration.js'), array('jquery', 'react', 'react-dom'));

        wp_register_script('skyfish-integration-admin-js', SKYFISHINTEGRATION_URL . '/dist/' . \SkyfishIntegration\Helper\CacheBust::name('js/SkyfishIntegrationAdmin.js'), array('jquery', 'react', 'react-dom'));
    }
}
