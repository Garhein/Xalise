using Microsoft.AspNetCore.Mvc.Rendering;
using Xalise.Core.Entites.Technique;
using Xalise.Core.Extensions;

namespace Xalise.Web.Helpers.WebHelpers
{
    public static class SelectListHelper
    {
        /// <summary>
        /// Ajout d'une option dans les éléments d'une liste déroulante. 
        /// </summary>
        /// <param name="items">Liste à laquelle ajouter l'option.</param>
        /// <param name="text">Texte à afficher.</param>
        /// <param name="value">Valeur de l'option.</param>
        /// <param name="selected">Indique si l'option est sélectionnée par défaut.</param>
        private static void _AddItem(ref List<SelectListItem> items, string text, string value, bool selected)
        {
            items.Add(
                new SelectListItem
                {
                    Text        = text,
                    Value       = value,
                    Selected    = selected
                }
            );
        }

        /// <summary>
        /// Construction de la liste déroulante des thèmes parents.
        /// </summary>
        /// <param name="listeApplications">Liste des applications.</param>
        /// <param name="valSelectionnee">Application sélectionnée par défaut.</param>
        /// <param name="ajouterLigneVide">Indique si une ligne vide doit être ajoutée à la liste déroulante.</param>
        /// <param name="titreLigneVide">Titre de la ligne vide.</param>
        /// <param name="titreSansResultat">Titre de l'option indiquant qu'aucune valeur n'est disponible.</param>
        /// <returns></returns>
        public static List<SelectListItem> ConstruireListeDeroulanteApplication(
                                           IEnumerable<ApplicationDTO> listeApplications,
                                           int? valSelectionnee = null,
                                           bool ajouterLigneVide = true,
                                           string titreLigneVide = "Sélectionnez une application",
                                           string titreSansResultat = "Aucune application disponible")
        {
            List<SelectListItem> retListe = new List<SelectListItem>();

            if (listeApplications.IsEmpty())
            {
                SelectListHelper._AddItem(ref retListe, titreSansResultat, string.Empty, true);
            }
            else
            {
                if (ajouterLigneVide)
                {
                    SelectListHelper._AddItem(ref retListe, titreLigneVide, string.Empty, !valSelectionnee.HasValue);
                }

                foreach (ApplicationDTO dto in listeApplications)
                {
                    SelectListHelper._AddItem(ref retListe, dto.Nom, dto.Id.ToString(), valSelectionnee.HasValue && valSelectionnee.Value == dto.Id);
                }
            }

            return retListe;
        }

        /// <summary>
        /// Construction de la liste déroulante des thèmes parents.
        /// </summary>
        /// <param name="listeTypeDeveloppement">Liste des types de développement.</param>
        /// <param name="valSelectionnee">Type sélectionné par défaut.</param>
        /// <param name="ajouterLigneVide">Indique si une ligne vide doit être ajoutée à la liste déroulante.</param>
        /// <param name="titreLigneVide">Titre de la ligne vide.</param>
        /// <param name="titreSansResultat">Titre de l'option indiquant qu'aucune valeur n'est disponible.</param>
        /// <returns></returns>
        public static List<SelectListItem> ConstruireListeDeroulanteTypeDeveloppement(
                                           IEnumerable<TypeDeveloppementDTO> listeTypeDeveloppement,
                                           int? valSelectionnee = null,
                                           bool ajouterLigneVide = true,
                                           string titreLigneVide = "Sélectionnez un type de développement",
                                           string titreSansResultat = "Aucun type de développement disponible")
        {
            List<SelectListItem> retListe = new List<SelectListItem>();

            if (listeTypeDeveloppement.IsEmpty())
            {
                SelectListHelper._AddItem(ref retListe, titreSansResultat, string.Empty, true);
            }
            else
            {
                if (ajouterLigneVide)
                {
                    SelectListHelper._AddItem(ref retListe, titreLigneVide, string.Empty, !valSelectionnee.HasValue);
                }

                foreach (TypeDeveloppementDTO dto in listeTypeDeveloppement)
                {
                    SelectListHelper._AddItem(ref retListe, dto.Nom, dto.Id.ToString(), valSelectionnee.HasValue && valSelectionnee.Value == dto.Id);
                }
            }

            return retListe;
        }
    }
}
