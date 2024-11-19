namespace Xalise.Core.Extensions
{
    /// <summary>
    /// Extensions applicables aux <see cref="string"/>.
    /// </summary>
    /// <author>Xavier VILLEMIN - xavier.villemin@gmail.com</author>
    public static class StringExtension
    {
        /// <summary>
        /// Indique si une chaîne est <see langword="null"/> ou vide (<c>""</c> ou <see cref="string.Empty"/>).
        /// </summary>
        /// <param name="src">Chaîne à tester.</param>
        /// <returns><see langword="true"/> si <paramref name="src"/> est <see langword="null"/> ou vide (<c>""</c>) ; sinon <see langword="false"/>.</returns>
        public static bool IsNullOrEmpty(this string src)
        {
            return string.IsNullOrEmpty(src);
        }

        /// <summary>
        /// Indique si une chaîne n'est pas <see langword="null"/> et non vide (<c>""</c> ou <see cref="string.Empty"/>).
        /// </summary>
        /// <param name="src">Chaîne à tester.</param>
        /// <returns><see langword="true"/> si <paramref name="src"/> n'est pas <see langword="null"/> et non vide (<c>""</c>) ; sinon <see langword="false"/>.</returns>
        public static bool IsNotNullOrEmpty(this string src)
        {
            return !string.IsNullOrEmpty(src);
        }

        /// <summary>
        /// Indique si une chaîne est <see langword="null"/>, vide (<c>""</c> ou <see cref="string.Empty"/>) ou composée uniquement d'espaces.
        /// </summary>
        /// <param name="src">Chaîne à tester.</param>
        /// <returns><see langword="true"/> si <paramref name="src"/> est <see langword="null"/>, vide (<c>""</c> ou <see cref="string.Empty"/>) ou composée uniquement d'espaces ; sinon <see langword="false"/>.</returns>
        public static bool IsNullOrWhiteSpace(this string src)
        {
            return string.IsNullOrWhiteSpace(src);
        }

        /// <summary>
        /// Indique si une chaîne n'est pas <see langword="null"/>, vide (<c>""</c> ou <see cref="string.Empty"/>) et composée uniquement d'espaces.
        /// </summary>
        /// <param name="src">Chaîne à tester.</param>
        /// <returns><see langword="true"/> si <paramref name="src"/> n'est pas <see langword="null"/>, vide (<c>""</c> ou <see cref="string.Empty"/>) et composée uniquement d'espaces ; sinon <see langword="false"/>.</returns>
        public static bool IsNotNullOrWhiteSpace(this string src)
        {
            return !string.IsNullOrWhiteSpace(src);
        }
    }
}
