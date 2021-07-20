function build_url(){
    base_url = "https://softaragones.org/conchugador/?sin_menu=true&sin_titol=true&sin_estilo=true"
    verbo = $('#js-data').data('verb');
    participio = $("input[name=participio]:checked").val();
    tiempo_pasau = $("input[name=tiempo_pasau]:checked").val();
    primer_plural = $("input[name=primer_plural]:checked").val();
    cherundio = $("input[name=cherundio]:checked").val();
    auxiliar_ser = $("input[name=auxiliar_ser]").prop('checked');
    incoativo = $("input[name=incoativo]").prop('checked');

    params = "&verbo=" + verbo +"&grafia=DGPL&participio=" + participio + "&tiempo_pasau=" + tiempo_pasau +
                "&primerPlural=" + primer_plural + "&cherundio=" + cherundio

    if (auxiliar_ser){
        params += "&auxiliar_ser=on"
    }
    if (incoativo){
        params += "&incoativo=on"
    }

    return base_url + params;
}

function load_conjugation(url){
    $.get( url, function( data ) {
        conjugation_table = $.parseHTML(data)[8];
        $("#conjugation").html(conjugation_table);
        $("tfoot").remove();
        $("#conjugation").css("margin-top", "20px");
        $("table").css("width", "100%");
        $("table").css("border-spacing", 5);
        $("table").css("border-collapse", "separate");
        $("th").css("background-color","#c8c8c8");
        $("td, th").css("margin","5px");
        $("td, th").css("padding","5px");
        $("td").css("background-color", "#f0f0f0");
    });
}

function init_default_options(){
    $("#options-form").hide();
    $(".fa-caret-left").css('visibility', 'hidden');
    select_option("id_participio_0");
    select_option("id_tiempo_pasau_2");
    select_option("id_primer_plural_0");
    select_option("id_cherundio_0");
    $("#id_auxiliar_ser").prop("checked", true);
$("#id_incoativo").prop("checked", true);
}

function select_option(id){
    id = "#" + id;
    $(id).prop("checked", true);
    $(id).closest(".rg-conjugator-options").find('.fa-caret-left').css('visibility', 'visible');
    $(id).closest(".conjugator-select").find(".rg-conjugator-options").css('font-weight', 'normal');
    $(id).closest(".rg-conjugator-options").css('font-weight', 'bold');
}

function unselect_options(id){
    id = "#" + id;
    $(id).closest(".conjugator-select").find('.fa-caret-left').css('visibility', 'hidden');
}

init_default_options();
load_conjugation(build_url());

$('.rg-conjugator-options').click(function() {
    id = $(this).find("input")[0].id;
    unselect_options(id);
    select_option(id);
    load_conjugation(build_url());
});

$('input[type=checkbox]').click(function() {
    load_conjugation(build_url());
});

$("#options-button").click(function() {
    $(this).find("i").toggleClass("fa-chevron-up fa-chevron-down");
    $("#options-form").slideToggle("slow");
});
