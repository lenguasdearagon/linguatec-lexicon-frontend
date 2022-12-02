$(function () {

    init_lexicon_button();

    function init_lexicon_button(){
        var selected_lexicon = $("#selected_lex").val();
        var lexicon_button = $(".button-lexicon-change");

        if (selected_lexicon == 'es-ar') {
            lexicon_button.removeClass('ar-es');
            lexicon_button.addClass('es-ar');
            $('#input-search').attr('placeholder', 'castellano-aragonés');
        } else if (selected_lexicon == 'ar-es') {
            lexicon_button.removeClass('es-ar');
            lexicon_button.addClass('ar-es');
            $('#input-search').attr('placeholder', 'aragonés-castellano');
        } else {
            // do nothing on other lexicons
        }
    }

    $(".button-lexicon-change").click(function() {
        var current_lexicon = $("#selected_lex").val();

        switch (current_lexicon) {
            case 'es-ar':
                new_lex = 'ar-es';
                break;

            case 'ar-es':
                new_lex = 'es-ar';
                break;

            default:
                // don't toggle lexicon direction
                new_lex = current_lexicon;
        }

        $("#selected_lex").val(new_lex);
        init_lexicon_button();
    });

    $("#topic-menu .topic-item").click(function() {
        let $topic = $(this);

        let button_lexicon_toggle = $(".button-lexicon-change");
        let button_topic = $("#button-topic");

        switch($topic.attr("id")) {
            case "topic-toggler":
                return; // is the menu toggler: nothing to do
            case "topic-general":
                button_lexicon_toggle.removeClass('d-none');
                button_topic.addClass('d-none');
        }

        $("#topic-menu .topic-item").removeClass("active");
        $topic.addClass("active");

        $("#selected_lex").val($topic.data("lexicode"));

        $('#input-search').attr('placeholder', $topic.data("lexidesc"));

        // update icon of button-lexicon-change
        /* TODO(@slamora): differentiate
            TOP) .rg-header .button-lexicon-change
            SEARCH BAR) .rg-search .button-lexicon-change
        */
        button_lexicon_toggle.addClass('d-none');

        let current_topic_icon = $topic.data("fa-icon");

        button_topic.removeClass("d-none");

        // remove other fa-icon
        let all_classes = [];
        $(".topic-item").each(function () {
            if ($(this).data("fa-icon")) {
                all_classes.push($(this).data("fa-icon"));
            }
        });
        button_topic.find('[data-fa-i2svg]')
            .removeClass(all_classes)
            .addClass(current_topic_icon);


    });

    $("#topic-toggler").click(function() {
        $("#topic-menu").toggleClass("unfolded");
    });

    // scroll to active topic
    $(".topic-menu-wrapper").animate({
        scrollLeft: $(".topic-menu-wrapper .topic-item.active").offset().left
    }, 2000);

    $("#input-search").autocomplete({
        source: function (request, response) {
            $.getJSON({
                url: autocomplete_api_url,
                data: {
                    q: request.term,
                    l: $("#selected_lex").val(),
                    limit: 5
                },
                success: function (json) {
                    const data = $.map(
                        json["results"],
                        word => word["term"]
                    );
                    response(data);
                }
            });
        },
        minLength: 1,
        // on select update input value and submit form
        select: function (event, ui) {
            $(this).val(ui.item.value);
            $(this).closest('form').trigger('submit');
        }
    });
});


function specialReadText(url, player_id) {
  // clear selected text to avoid be read by speaker
  var sel = window.getSelection ? window.getSelection() : document.selection;
  if (sel) {
      if (sel.removeAllRanges) {
          sel.removeAllRanges();
      } else if (sel.empty) {
          sel.empty();
      }
  }
  // ugly hack because timing affects player behaviour
  setTimeout(() => { readpage(url, player_id); }, 200);
}
