$(function () {

    init_dictionary_button();

    function init_dictionary_button(){
        selected_dictionary = $("#selected_lex").val();
        if (selected_dictionary == 'es-ar'){
            $(".button-dictionary-change").removeClass('ar-es');
            $(".button-dictionary-change").addClass('es-ar');
            $(".button-dictionary-change").data("dictionary", "to-ar-es");
            $('#input-search').attr('placeholder', 'castellano-aragonés');
        } else {
            $(".button-dictionary-change").removeClass('es-ar');
            $(".button-dictionary-change").addClass('ar-es');
            $(".button-dictionary-change").data("dictionary", "to-es-ar");
            $('#input-search').attr('placeholder', 'aragonés-castellano');
        }
    }

    $(".button-dictionary-change").click(function() {
        console.log($(this).data("dictionary"));
        selected_dictionary = $(this).data("dictionary").replace("to-","");
        $('#selected_lex option[value="' + selected_dictionary + '"]').prop('selected', true);
        init_dictionary_button();
    });

    $("#input-search").autocomplete({
        source: function (request, response) {
            $.getJSON({
                url: "{{ autocomplete_api_url }}",
                data: {
                    q: request.term,
                    l: $("#selected_lex :selected").val(),
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