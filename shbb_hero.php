<?php

/**
* Plugin Name: Shbb Hero
* Plugin URI: https://alextheme.github.io
* Description: Add Shortcode hero block to theme
* Version: 0.0.2
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
    define( 'SHBB_PLUGIN_VERSION', '0.0.2' );
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

    public function hero_shortcode($atts = array()){

        extract(shortcode_atts(array(
            'title' => 'Unser Mix aus,Innovation,und Kreativität',
            'title_accent' => 2,
            'cell_radius' => 0,
            'subtitle' => 'brumm digital Projekte',
            'links' => 'Branding(http://localhost),WebDesign(http://localhost),Programmierung(#),SEO & SEA(#)',
        ), $atts));

        /**
         * Heading
         * title="Unser Mix aus,Innovation,und Kreativität"
         * title_accent="3"
         * subtitle="brumm digital Projekte"
         */
        $title_arr = explode(',', $title);
        $heading = '<h1 class="hero_title">';
        for ($k = 0; $k < count($title_arr); $k++) {

            if ($k !== 0) $heading .= '<br>';

            if ($title_accent == $k + 1) {
                $heading .= '<span class="accent">'.$title_arr[$k].'</span>';
            } else {
                $heading .= '<span>'.$title_arr[$k].'</span>';
            }

        }
        $heading .= '</h1><span class="hero_subtitle">'. $subtitle .'</span>';


        /**
         * Brand List
         * image in folder - assets/img/brand/
         */
        $img_dir = SHBB_PLUGIN_PATH.'/assets/img/';
        $brand_images = glob($img_dir . 'brand/*.{jpg,jpeg,png}', GLOB_BRACE);

        $brands_list = '<ul class="hero__brands">';
        foreach ($brand_images as $img) {
            $brands_list .= '<li class="hero__brand"><div class="hero__brand_img_w"><img class="hero__brand_img" src="';
            $brands_list .= plugins_url('/shbb_hero/assets/img/brand/') . basename($img);
            $brands_list .= '" alt=""></div></li>';
        }
        $brands_list .= '</ul>';


        /**
         * Mask SVG
         * cell_radius="0"
         */
        $uniq_id = uniqid('');

        $count_row_mask = 3;
        $count_col_mask = 4;
        $cell_radius = empty($cell_radius) ? 0 : abs((int) $cell_radius);
        if ($cell_radius === 0) {
            $svg_mask_cell = str_repeat('<rect x="0" y="0" width="0" height="0"/>', $count_row_mask * $count_col_mask);
        } else {
            $svg_mask_cell = str_repeat(str_repeat('<circle cx="0" cy="0" r="0"/>', 4) . str_repeat('<rect x="0" y="0" width="0" height="0"/>', 2), $count_row_mask * $count_col_mask);
        }
        $svg_mask = '<mask id="mask_'. $uniq_id .'">' . $svg_mask_cell . '</mask>';


        /**
         * SVG background image
         * image in folder - assets/img/bg/
         * 0 - PC, 1 - Tablet, 3 - Mobile
         */
        $bg_images = glob($img_dir . 'bg/*.{jpg,jpeg,png}', GLOB_BRACE);

        $svg_bg_img = '<image xmlns:xlink="http://www.w3.org/1999/xlink" id="svg_img_bg_'.$uniq_id.'" xlink:href="" ';
        for ($j = 0; $j < count($bg_images); $j++) {
            $img_url = plugins_url('/shbb_hero/assets/img/bg/') . basename($bg_images[$j]);
            $data_img = getimagesize(SHBB_PLUGIN_PATH.'/assets/img/bg/'.basename( $bg_images[$j] ));

            $svg_bg_img .= 'data-img_href_'.$j.'="'.$img_url.'" ';
            $svg_bg_img .= 'data-img_size_'.$j.'="'.$data_img[0].','.$data_img[1].'"';
        }

        $svg_bg_img .= 'mask="url(#mask_'. $uniq_id .')" width="816px" height="628px" ></image>';

        $svg = '<svg id="svg_anim_block_'.$uniq_id.'" class="svg_anim_block" data-cell_radius="'.$cell_radius.'">';
        $svg .= '<style>#mask_'.$uniq_id.' circle, #svgmask1 polygon, #mask_'.$uniq_id.' rect {fill: #fff}</style>';
        $svg .= $svg_mask . $svg_bg_img . '</svg>';


        /**
         * Links
         * links="Бренди(http://localhost),Веб Дизайн(http://localhost),Програмування(#),SEO & SEA(#)"
         */
        $anchor_list = explode(',', $links);
        $anchors = '<ul class="hero__anim_block_list_links">';
        foreach ($anchor_list as $anchor_srt) {
            $anchor_arr = explode('(', $anchor_srt);
            $anchors .= '<li class="hero__anim_block_item_link">';
            $anchors .= '<a class="hero__anim_block_link" href="'. str_replace(")", "", $anchor_arr[1]) .'">'. $anchor_arr[0] .'</a></li>';
        }
        $anchors .= '</ul>';

        /**
         * output
         */
        $output = '<div class="shbb_hero hero">
            <div class="wrapper">
                <div class="hero__row">
        
                    <div class="hero__col">
                        <div class="hero__heading">'.$heading.'</div>
                        <div class="hero__brands_w">'.$brands_list.'</div>
                    </div>
        
                    <div class="hero__col">
                        <div class="hero__anim_block">
                            <div class="hero__svg_wrap">'.$svg . $anchors .'</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>';

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




