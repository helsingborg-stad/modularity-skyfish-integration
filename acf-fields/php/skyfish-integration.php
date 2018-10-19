<?php 

if (function_exists('acf_add_local_field_group')) {
    acf_add_local_field_group(array(
    'key' => 'group_5bba400a04b6c',
    'title' => __('Skyfish Integration - Settings', 'skyfish-integration'),
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
                827312 => __('Public', 'skyfish-integration'),
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
        1 => array(
            'key' => 'field_5bc723fbe4179',
            'label' => __('Order by', 'skyfish-integration'),
            'name' => 'skyfish_order',
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
                'created' => __('Publish date', 'skyfish-integration'),
                'camera_created' => __('Camera date', 'skyfish-integration'),
                'relevance' => __('Relevance', 'skyfish-integration'),
            ),
            'default_value' => array(
                0 => 'created',
            ),
            'allow_null' => 0,
            'multiple' => 0,
            'ui' => 0,
            'return_format' => 'value',
            'ajax' => 0,
            'placeholder' => '',
        ),
        2 => array(
            'key' => 'field_5bc724eae417a',
            'label' => __('Order direction', 'skyfish-integration'),
            'name' => 'skyfish_direction',
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
                'desc' => __('Descending', 'skyfish-integration'),
                'asc' => __('Ascending', 'skyfish-integration'),
            ),
            'default_value' => array(
                0 => 'desc',
            ),
            'allow_null' => 0,
            'multiple' => 0,
            'ui' => 0,
            'return_format' => 'value',
            'ajax' => 0,
            'placeholder' => '',
        ),
        3 => array(
            'key' => 'field_5bc7283ce417c',
            'label' => __('Search mode', 'skyfish-integration'),
            'name' => 'skyfish_search_mode',
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
                'default' => __('Default', 'skyfish-integration'),
                'strict_and_search' => __('Strict', 'skyfish-integration'),
                'wildcards' => __('Soft', 'skyfish-integration'),
            ),
            'default_value' => array(
                0 => 'default',
            ),
            'allow_null' => 1,
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