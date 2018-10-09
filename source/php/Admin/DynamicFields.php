<?php

namespace SkyfishIntegration\Admin;

class DynamicFields
{
    public function __construct()
    {
        add_action('acf/load_field/name=skyfish_folder', array($this, 'populatetWithFolders'));
    }

    public function populatetWithFolders($field)
    {
        $api = new \SkyfishIntegration\Api();

        //Reset choices
        $field['choices'] = array();

        if (!$api->authenticate()) {
            return $field;
        }

        if (is_array($api->getFolders()) && !empty($api->getFolders())) {
            foreach ($api->getFolders() as $folder) {
                $field['choices'][$folder->id] = $folder->name;
            }
        }

        return $field;
    }
}
