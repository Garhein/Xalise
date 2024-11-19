using Xalise.Core.Extensions;

namespace Xalise.Interop.HL7.Helpers
{
    /// <summary>
    /// Fonctions de manipulation associés aux champs d'un segment HL7.
    /// </summary>
    /// <author>Xavier VILLEMIN - xavier.villemin@gmail.com</author>
    public static class FieldHelper
    {
        /// <summary>
        /// Construit la représentation textuelle du numéro d'un champ.
        /// </summary>
        /// <remarks>
        /// <c>FieldHelper.ConstructFieldNumber("MSH", 21, 1, 2)</c> retourne la valeur <c>MSH-21.1/2</c>.<br/>
        /// Cette valeur correspondant au 2ème sous-champ de la 1ère répétition du champ 21 du segment MSH.
        /// </remarks>
        /// <param name="segmentName">Nom du segment.</param>
        /// <param name="fieldNumber">Numéro du champ.</param>
        /// <param name="repNumber">Numéro de la répétition.</param>
        /// <param name="subFieldNumber">Numéro du sous-champ.</param>
        /// <returns>La représentation textuelle du numéro du champ.</returns>
        /// <exception cref="ArgumentException">Si <paramref name="segmentName"/> est <see langword="null"/>, vide (<c>""</c>) ou composé uniquement d'espaces.</exception>
        /// <exception cref="ArgumentException">Si <paramref name="fieldNumber"/> est inférieur ou égal à 0.</exception>
        public static string ConstructFieldNumber(string segmentName, int fieldNumber, int? repNumber = null, int? subFieldNumber = null)
        {
            if (segmentName.IsNullOrWhiteSpace())
            {
                throw new ArgumentException("Nom du segment non valide.", nameof(segmentName));
            }

            if (fieldNumber <= 0)
            {
                throw new ArgumentException("Numéro du champ non valide.", nameof(fieldNumber));
            }

            string retVal = $"{segmentName}-{fieldNumber}";

            if (repNumber.GetValueOrDefault() > 0)
            {
                retVal = $"{retVal}.{repNumber.GetValueOrDefault()}";

                if (subFieldNumber.GetValueOrDefault() > 0)
                {
                    retVal = $"{retVal}/{subFieldNumber.GetValueOrDefault()}";
                }
            }

            return retVal;
        }
    }
}
