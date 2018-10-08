<?php 

if (function_exists('acf_add_local_field_group')) {
    acf_add_local_field_group(array(
    'key' => 'group_5bba400a04b6c',
    'title' => __('Modularity Module: Skyfish Integration', 'skyfish-integration'),
    'fields' => array(
        0 => array(
            'key' => 'field_5bba400d10454',
            'label' => __('Select folder', 'skyfish-integration'),
            'name' => 'skyfish_folder',
            'type' => 'select',
            'instructions' => '',
            'required' => 1,
            'conditional_logic' => 0,
            'wrapper' => array(
                'width' => '',
                'class' => '',
                'id' => '',
            ),
            'choices' => array(
                424682 => __('Public', 'skyfish-integration'),
                819213 => __('Videoklipp', 'skyfish-integration'),
                845327 => __('CC BY-bilder', 'skyfish-integration'),
                1296342 => __('Trash', 'skyfish-integration'),
                1297856 => __('Api', 'skyfish-integration'),
            ),
            'default_value' => array(
            ),
            'allow_null' => 0,
            'multiple' => 0,
            'ui' => 0,
            'return_format' => 'value',
            'ajax' => 0,
            'placeholder' => '',
        ),
    ),
    'location' => array(
        0 => array(
            0 => array(
                'param' => 'post_type',
                'operator' => '==',
                'value' => 'mod-skyfish-gallery',
            ),
        ),
    ),
    'menu_order' => 0,
    'position' => 'normal',
    'style' => 'default',
    'label_placement' => 'top',
    'instruction_placement' => 'label',
    'hide_on_screen' => '',
    'active' => 1,
    'description' => '',
));
}