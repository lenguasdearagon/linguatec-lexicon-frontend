$(function () {

    init_dictionary_button();

    function init_dictionary_button(){
        var selected_dictionary = $("#selected_lex").val();
        if (selected_dictionary == 'es-ar'){
            $(".button-dictionary-change").removeClass('ar-es');
            $(".button-dictionary-change").addClass('es-ar');
            $('#input-search').attr('placeholder', 'castellano-aragonés');
        } else {
            $(".button-dictionary-change").removeClass('es-ar');
            $(".button-dictionary-change").addClass('ar-es');
            $('#input-search').attr('placeholder', 'aragonés-castellano');
        }
    }

    $(".button-dictionary-change").click(function() {
        var current_lexicon = $("#selected_lex").val();
        $("#selected_lex").val(current_lexicon == 'es-ar' ? 'ar-es' : 'es-ar');
        init_dictionary_button();
    });

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
