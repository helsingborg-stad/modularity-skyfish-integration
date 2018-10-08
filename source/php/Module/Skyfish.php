<?php

namespace SkyfishIntegration\Module;

class Skyfish extends \Modularity\Module
{
    public $slug = 'skyfish-gallery';
    public $supports = array();

    public function init()
    {
        $this->nameSingular = __("Skyfish Gallery", 'modularity-sections');
        $this->namePlural = __("Skyfish Galleries", 'modularity-sections');
        $this->description = __("Retrives and output downloadable images from Skyfish.", 'skyfish-integration');
    }

    public function data() : array
    {
        $data = array();

        //Send to view
        return $data;
    }

    public function template() : string
    {
        return "skyfish.blade.php";
    }

    public function script()
    {
        \SkyfishIntegration\Helper\React::enqueue();

        wp_enqueue_script('skyfish-integration-js');
        wp_localize_script('skyfish-integration-js', 'skyfishData', $this->scriptData());
    }

    public function scriptData()
    {
        $data = array();

        $data['nonce'] = wp_create_nonce('skyfishIntegration');

        $api = new \SkyfishIntegration\Api();
        $api->authenticate();

        if ($api->token) {
            $data['authToken'] = $api->token;
            $data['baseUrl'] = $api->url;
        }

        if (get_field('skyfish_folder', $this->data['ID'])) {
            $data['rootFolder'] = get_field('skyfish_folder',$this->data['ID']);
        }

        //Send to script
        return $data;
    }

    public function style()
    {
        wp_enqueue_style('skyfish-integration-css');
    }

    /**
     * Available "magic" methods for modules:
     * init()            What to do on initialization
     * data()            Use to send data to view (return array)
     * style()           Enqueue style only when module is used on page
     * script            Enqueue script only when module is used on page
     * adminEnqueue()    Enqueue scripts for the module edit/add page in admin
     * template()        Return the view template (blade) the module should use when displayed
     */
}
