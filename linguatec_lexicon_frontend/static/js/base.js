$(function () {

    init_lexicon_button();
    init_topic_button($(".topic-item.active"));

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

    function init_topic_button($topic) {

        let button_lexicon_toggle = $(".button-lexicon-change");
        let button_topic = $(".button-topic");

        switch($topic.attr("id")) {
            case "topic-toggler":
                button_lexicon_toggle.addClass('d-none');
                button_topic.removeClass("d-none");
                $('#input-search').attr('placeholder', 'Selecciona área temática')
                $(".topic-toggler").removeClass("some-topic-active");
                $("#logo-caption").html("Diccionario<br>\npor áreas temáticas");

                return; // is the menu toggler: nothing else to do
            case "topic-general":
                button_lexicon_toggle.removeClass('d-none');
                button_topic.addClass('d-none');
                $(".topic-toggler").removeClass("some-topic-active");
                $("#logo-caption").html("Diccionario<br>\ncastellano/aragonés<br>\naragonés/castellano");
                break;

            default:
                button_lexicon_toggle.addClass('d-none');
                button_topic.removeClass("d-none");
                $(".topic-toggler").addClass("some-topic-active");
                $("#logo-caption").html("Diccionario<br>\npor áreas temáticas<br>\n" + $topic.data("lexidesc"));
                $("#topic-general").removeClass("active");
        }

        $("#topic-menu .topic-item").removeClass("active");
        $topic.addClass("active");

        $("#selected_lex").val($topic.data("lexicode"));

        $('#input-search').attr('placeholder', $topic.data("lexidesc"));

        // remove other fa-icon
        let all_classes = [];
        $(".topic-item").each(function () {
            if ($(this).data("fa-icon")) {
                all_classes.push($(this).data("fa-icon"));
            }
        });
        let current_topic_icon = $topic.data("fa-icon") || "fa-ellipsis-v";
        button_topic.find('[data-fa-i2svg]')
            .removeClass(all_classes)
            .addClass(current_topic_icon);

    }

    $("#topic-general").click(function() {
        init_topic_button($(this));
        $("#input-search").val("");
    });

    $("#topic-menu .topic-item").click(function() {
        init_topic_button($(this));
        $("#input-search").val("");
    });

    $("#topic-toggler").click(function() {
        $("#topic-menu").toggleClass("unfolded");
        if($("#topic-menu").hasClass("unfolded")) {
            init_topic_button($(this));
        } else {
            init_topic_button($("#topic-general"));
        }
    });

    $("#topic-toggler-base").click(function() {
        $(".topic-menu-wrapper").toggleClass("collapsed");
    });

    // if the user goes to input search without choosing a topic
    // perform search to general dictionary.
    $(".home #input-search").focus(function() {
        if(!$("#topic-toggler").hasClass("some-topic-active")) {
            init_topic_button($("#topic-general"));
            $("#topic-menu").removeClass("unfolded");
        }
    });

    // scroll to active topic
    if($(".topic-menu-wrapper .topic-item.active").length) {
        let wrapper_offset = $(".topic-menu-wrapper .topic-item.active").parent().parent().offset()
        let active_topic_offset = $(".topic-menu-wrapper .topic-item.active").parent().offset();
        let diff = active_topic_offset.left - wrapper_offset.left;

        $(".topic-menu-wrapper").animate({
            scrollLeft: diff
        }, 2000);
    }

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
