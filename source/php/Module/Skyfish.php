<?php

namespace SkyfishIntegration\Module;

class Skyfish extends \Modularity\Module
{
    public $slug = 'skyfish-gallery';
    public $supports = array();

    public function init()
    {
        $this->nameSingular = __("Skyfish Gallery", 'skyfish-integration');
        $this->namePlural = __("Skyfish Galleries", 'skyfish-integration');
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
        wp_localize_script('skyfish-integration-js', 'skyfishAjaxObject', $this->scriptData());
    }

    public function scriptData()
    {
        $data = array();
        $data['nonce'] = wp_create_nonce('skyfishIntegration');

        $api = new \SkyfishIntegration\Api();
        $api->authenticate();

        //Skyfish API Settings
        $data['apiSettings'] = array(
            'authToken'     => $api->token,
            'baseUrl'       => $api->url,
            'rootFolder'    => (get_field('skyfish_folder', $this->data['ID'])) ? get_field('skyfish_folder', $this->data['ID']) : null,
            'orderBy'       => (get_field('skyfish_order', $this->data['ID'])) ? get_field('skyfish_order', $this->data['ID']) : 'created',
            'orderDirection' => (get_field('skyfish_direction', $this->data['ID'])) ? get_field('skyfish_direction', $this->data['ID']) : 'desc',
            'searchMode'    => (get_field('skyfish_search_mode', $this->data['ID'])) ? get_field('skyfish_search_mode', $this->data['ID']) : 'default'
        );

        //Translation strings
        $data['translation'] = array(
            'foundXItems' => __('Found %s items, display page %s of %s.', 'skyfish-integration'),
            'xResults' => __('%s results, display page %s of %s.', 'skyfish-integration'),
            'search' => __('Search', 'skyfish-integration'),
            'next' => __('Next', 'skyfish-integration'),
            'previous' => __('Previous', 'skyfish-integration'),
            'download' => __('Download', 'skyfish-integration'),
            'uploaded' => __('Uploaded', 'skyfish-integration'),
            'resolution' => __('Resolution', 'skyfish-integration'),
            'size' => __('Storlek', 'skyfish-integration'),
            'mimeType' => __('Mime Type', 'skyfish-integration'),
            'taken' => __('Taken', 'skyfish-integration'),
            'photographer' => __('Photographer', 'skyfish-integration'),
            'storlek' => __('Size', 'skyfish-integration'),
            'details' => __('Details', 'skyfish-integration'),
            'keywords' => __('Keywords', 'skyfish-integration'),
            'goBack' => __('Go back', 'skyfish-integration'),
            'original' => __('Original', 'skyfish-integration'),
            'large' => __('Large', 'skyfish-integration'),
            'medium' => __('Medium', 'skyfish-integration'),
            'small' => __('Small', 'skyfish-integration'),
            'publishDate' => __('Publish date', 'skyfish-integration'),
            'cameraDate' => __('Camera date', 'skyfish-integration'),
            'relevance' => __('Relevance', 'skyfish-integration'),
            'descending' => __('Descending', 'skyfish-integration'),
            'ascending' => __('Ascending', 'skyfish-integration')
        );

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
