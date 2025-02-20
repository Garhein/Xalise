using Xalise.Core.Extensions;

namespace Xalise.Interop.HL7.Helpers
{
    /// <summary>
    /// Fonctions de manipulation associés aux segments HL7.
    /// </summary>
    /// <author>Xavier VILLEMIN - xavier.villemin@gmail.com</author>
    public static class SegmentHelper
    {
        /// <summary>
        /// Liste des segments qui définissent les caractères d'encodage.
        /// </summary>
        private static List<string> SegmentWithDefinitionDelimiters => new List<string>() { "MSH", "FHS", "BHS" };

        /// <summary>
        /// Détermine si le segment définit les caractères d'encodage.
        /// </summary>
        /// <param name="segmentName">Code du segment.</param>
        /// <returns><see langword="true"/> si <paramref name="segmentName"/> définit les caractères d'encodage ; sinon <see langword="false"/>.</returns>
        /// <exception cref="ArgumentException">Si <paramref name="segmentName"/> est <see cref="StringExtension.IsNullOrWhiteSpace(string)"/>.</exception>
        public static bool IsSegmentDefDelimiters(string segmentName)
        {
            if (segmentName.IsNullOrWhiteSpace())
            {
                throw new ArgumentException("Le segment à vérifier ne peut pas être NULL, vide ou composée uniquement d'espaces.", nameof(segmentName));
            }
            
            return SegmentHelper.SegmentWithDefinitionDelimiters.Contains(segmentName);
        }
    }
}
