<?php

namespace SkyfishIntegration;

class App
{
    public function __construct()
    {
        add_action('admin_enqueue_scripts', array($this, 'enqueueStyles'));
        add_action('admin_enqueue_scripts', array($this, 'enqueueScripts'));
    }

    /**
     * Enqueue required style
     * @return void
     */
    public function enqueueStyles()
    {
        wp_register_style('skyfish-integration-css', SKYFISHINTEGRATION_URL . '/dist/' . \SkyfishIntegration\Helper\CacheBust::name('css/skyfish-integration.css'));
    }

    /**
     * Enqueue required scripts
     * @return void
     */
    public function enqueueScripts()
    {
        wp_register_script('skyfish-integration-js', SKYFISHINTEGRATION_URL . '/dist/' . \SkyfishIntegration\Helper\CacheBust::name('js/skyfish-integration.js'));
    }
}
