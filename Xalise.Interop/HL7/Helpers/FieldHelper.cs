using System;
using Xalise.Core.Helpers;

namespace Xalise.Interop.HL7.Helpers
{
    /// <summary>
    /// Fonctions utilitaires pour manipuler les champs.
    /// </summary>
    public static class FieldHelper
    {
        /// <summary>
        /// Construit le numéro représentant un champ.
        /// </summary>
        /// <param name="segmentName">Nom du segment.</param>
        /// <param name="numField">Numéro du champ.</param>
        /// <param name="numRepetition">Numéro de la répétition.</param>
        /// <param name="numSubComponent">Numéro du sous-composant.</param>
        /// <returns></returns>
        /// <exception cref="ArgumentException">Si <paramref name="segmentName"/> est <seealso langword="null"/>, vide (<c>""</c>) ou composé uniquement d'espaces.</exception>
        /// <exception cref="ArgumentException">Si <paramref name="numField"/> est inférieur ou égal à 0.</exception>
        public static string ConstructFieldNumber(string segmentName, int numField, int? numRepetition = null, int? numSubComponent = null)
        {
            ArgumentHelper.ThrowIfNullOrWhiteSpace(segmentName, nameof(segmentName));

            if (numField <= 0)
            {
                throw new ArgumentException("Numéro de champ non valide.", nameof(numField));
            }

            string retVal = $"{segmentName}-{numField}";

            if (numRepetition.HasValue && numRepetition.Value > 0)
            {
                retVal = $"{retVal}.{numRepetition.Value}";

                if (numSubComponent.HasValue && numSubComponent.Value > 0)
                {
                    retVal = $"{retVal}/{numSubComponent.Value}";
                }
            }

            return retVal;
        }
    }
}
