<div class="grid">
    @if (!$hideTitle && !empty($post_title))
    <div class="grid-xs-12">
        <h4 class="box-title">{!! apply_filters('the_title', $post_title) !!}</h4>
    </div>
    @endif
    <div class="grid-xs-12">
        <div id="skyfish-module"></div>
    </div>
</div>

