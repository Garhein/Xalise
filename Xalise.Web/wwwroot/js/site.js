// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

$(function () {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
});

//#region Constantes globales : formulaires

const CONST_FORM_CLASS_FIXED_VALUES = ".x-form-fixed-value";

//#endregion

//#region Prototypes

if (!String.format) {
    String.format = function (format) {
        let args = Array.prototype.slice.call(arguments, 1);

        return format.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

//#endregion

/**
 * Vide les champs d'un formulaire de saisie.
 * @param {object} eltHtml
 * @author Xavier VILLEMIN
 */
function Xalise_ViderFormulaire(eltHtml) {
    "use strict";

    let form = $(eltHtml).closest('form');

    $(String.format("input[type='text']:not({0})", CONST_FORM_CLASS_FIXED_VALUES), form).val("");
    $(String.format("input[type='hidden'][value!=false]:not({0})", CONST_FORM_CLASS_FIXED_VALUES), form).val("");
    $(String.format("input[type='checkbox']:not({0})", CONST_FORM_CLASS_FIXED_VALUES), form).prop("checked", false);
    $(String.format("textarea:not({0})", CONST_FORM_CLASS_FIXED_VALUES), form).val("");

    form.find(String.format("select:not({0})", CONST_FORM_CLASS_FIXED_VALUES)).each(function () {
        if ($(this).attr("multiple") != undefined) {
            $("option", $(this)).prop('selected', false);
        }
        else {
            $("option:first", $(this)).prop('selected', true);
        }
    });
}
