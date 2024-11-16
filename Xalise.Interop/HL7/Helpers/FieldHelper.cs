using Xalise.Core.Extensions;

namespace Xalise.Interop.HL7.Helpers
{
    /// <summary>
    /// Fonctions utilitaires de manipulation des champs.
    /// </summary>
    public static class FieldHelper
    {
        /// <summary>
        /// Construit la représentation textuelle du numéro d'un champ.<br/>
        /// Exemple : MSH-21.1/2 (2ème sous-champ de la 1ère répétition du champ 21 du segment MSH).
        /// </summary>
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
