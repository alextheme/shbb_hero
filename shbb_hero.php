<?php

/**
* Plugin Name: Shbb Hero
* Plugin URI: https://alextheme.github.io
* Description: Add Shortcode hero block to theme
* Version: 0.1.0
* Author: Oleksandr Borymskyi
* Author URI: https://alextheme.github.io
* Text Domain: shbbhero
* Recommended Image Svg Size: PC 77%, Mobile 93%
*/


defined( 'ABSPATH' ) || exit;

if ( ! defined( 'SHBB_PLUGIN_PATH' ) ) {
    define( 'SHBB_PLUGIN_PATH', dirname(__FILE__) );
}
if ( ! defined( 'SHBB_PLUGIN_VERSION' ) ) {
    define( 'SHBB_PLUGIN_VERSION', '0.1.0' );
}

class ShbbHero {

    public function __construct(){
        add_action('wp_enqueue_scripts', [$this,'enqueue_front']);
        add_action('init',[$this,'register_shortcode']);
    }

    public function enqueue_front(){
        wp_enqueue_style('shbbhero_style', plugins_url('/assets/css/front/style.css',__FILE__), array(), SHBB_PLUGIN_VERSION);
        wp_enqueue_script('shbbhero_script', plugins_url('/assets/js/front/scripts.js', __FILE__),array('jquery'),SHBB_PLUGIN_VERSION,true);
    }

    public function register_shortcode(){
        add_shortcode('shbb_hero',[$this,'hero_shortcode']);
    }

    public function hero_shortcode($atts = array()) {

        extract(shortcode_atts(array(
            'rx' => 0, // 0px
            'gap' => 2.45, // 2.45%
            'links' => 'Branding(http://localhost),WebDesign(http://localhost),Programmierung(#),SEO & SEA(#)',
            'bg' => '6161,6125,5806,5976,5802', // ids images gallery
            'ratio' => '77,93,93', // PC, Tablet, Mobile %
            'h_middle' => 22.3, // 22.3%
            'h_top_el' => '60, 53, 45, 70',
            'h_random' => false,
        ), $atts));

        $uniqueId = uniqid();
        $anchor_list = explode(',', $links);
        $count_col = count($anchor_list);

        $bg_ids = array_map('trim', explode(',', $bg));
        $bg_ids = array_pad($bg_ids, count($anchor_list), $bg_ids[0]);

        $radius_mask = is_int((int) $rx) ? abs((int) $rx) : 0;
        $gap = is_int((int) $gap) ? abs((int) $gap) : 0; // 2.45%
        $width_item = (100 - ($count_col - 1) * $gap) / $count_col;
        $h_middle = is_int((int) $h_middle) ? abs((int) $h_middle) : 0;

        if ($h_random) {
            $h_top_elements = range(30, 70);
            shuffle($h_top_elements );
            $h_top_elements = array_slice($h_top_elements ,0,$count_col);
        } else {
            $h_top_elements = array_map('trim', explode(',', $h_top_el));
            $h_top_elements = array_pad($h_top_elements, $count_col, rand(0, 100));
        }
        $h_top_elements = implode(',', $h_top_elements);

        $data_params = ' data-gap="'. $gap .'" data-radius="'. $radius_mask .'" data-h_middle="'. $h_middle .'" data-h_top_elements="'. $h_top_elements .'" data-ratio="'. $ratio .'" ';

        /**
         * Links
         * links="Бренди(http://localhost),Веб Дизайн(http://localhost),Програмування(#),SEO & SEA(#)"
         */
        $output = '<ul class="listblock__list" style="grid-template-columns: repeat('. $count_col .', '. $width_item .'%); gap:0 '. $gap .'%">';
        foreach ($anchor_list as $key => $anchor_srt) {
            $anchor = explode('(', $anchor_srt);
            $bg_url = wp_get_attachment_image_src( $bg_ids[$key], "attached-image");
            $clip_path_id = 'clipPath_'. $uniqueId .'-'. $key;

            $output .= '<li class="listblock__item" >';
            $output .= '<svg height="0" width="0"><defs><clipPath id="'. $clip_path_id .'">
                <rect x="0" y="0"   width="100" height="100" rx="'.$radius_mask.'"/>
                <rect x="0" y="120" width="100" height="100" rx="'.$radius_mask.'"/>
                <rect x="0" y="240" width="100" height="100" rx="'.$radius_mask.'"/>
            </clipPath></defs></svg>';
            $output .= is_array($bg_url) ? '<img class="listblock__item_img" style="clip-path: url(#'. $clip_path_id .')" src="'. esc_url($bg_url[0]) .'" alt="" />' : '';
            $output .= '<a class="listblock__link" style="border-radius:'.$radius_mask.'px" href="'. str_replace(")", "", $anchor[1]) .'">'. $anchor[0] .'</a>';

            $output .= '</li>';
        }
        $output .= '</ul>';


        /**
         * output
         */
        $output = '<div class="shbb listblock" id="listblock_'. $uniqueId .'" '. $data_params .'>
            <div class="listblock__wrapper">'. $output .'</div></div>';


        return $output;
    }

    static function activation_plugin(){
        flush_rewrite_rules();
    }
    static function deactivation_plugin(){
        flush_rewrite_rules();
    }
}

if(class_exists('ShbbHero')){
    $shbbHero = new ShbbHero();
}

register_activation_hook(__FILE__, array($shbbHero,'activation_plugin') );
register_deactivation_hook(__FILE__, array($shbbHero,'deactivation_plugin') );




