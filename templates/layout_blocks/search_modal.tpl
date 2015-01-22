      <!-- div trigger modal -->
<div class="top-search" data-toggle="modal" data-target="#myModal1"></div>
<!-- Modal -->
<div class="ls_search_modal_fade modal fade" id="myModal1" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="ls_search_modal_dialog modal-dialog">
    <div class="ls_search_modal_content modal-content">
      <div class="ls_search_modal_header modal-header">
          <div class="ls_close_modal ls_close_window" data-dismiss="modal"><!--span aria-hidden="true">&times;</span--><a href="#">{__("close")}</a></div>
        <!--button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">{__("close")}</span></button-->
      </div>
      <div class="ls_search_body modal-body">
        <div class="ty-search-block ls_search_block modal_block">
            <form method="get" name="search_form" action="http://coriolan.leadsoft.eu/" class="cm-processed-form ls_search_modal_form modal_form">
                <input type="hidden" value="Y" name="subcats">
                <input type="hidden" value="A" name="status">
                <input type="hidden" value="Y" name="pshort">
                <input type="hidden" value="Y" name="pfull">
                <input type="hidden" value="Y" name="pname">
                <input type="hidden" value="Y" name="pkeywords">
                <input type="hidden" value="Y" name="search_performed">
                <input type="text" class="ty-search-block__input cm-hint ls_search_input" title="Cauta produse" id="search_input" value="" name="hint_q" autofocus><button type="submit" class="ty-search-magnifier" title="Cautati"><i class="ty-icon-search"></i></button>
                <input type="hidden" value="products.search" name="dispatch">
            </form>
        </div>
      </div>
      <div class="ls_search_footer modal-footer">
        Cauti ceva anume?
      </div>
    </div>
  </div>
</div>