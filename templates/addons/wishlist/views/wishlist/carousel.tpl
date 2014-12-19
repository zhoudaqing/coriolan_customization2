{if !$wishlist_is_empty}
    {script src="js/tygh/exceptions.js"}
{/if}



<span id="preferateCarousel">
Produse {$products|count}
<ul>
	{foreach from=$products item=prod}
		<li>{$prod.product} Pr</li>
	{foreachelse}
		<li>Nici un produs</li>
	{/foreach}
</ul>
</span>

