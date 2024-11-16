namespace Xalise.Core.Extensions
{
    /// <summary>
    /// Méthodes d'extension applicables aux <see cref="string"/>.
    /// </summary>
    public static class StringExtension
    {
        /// <summary>
        /// Indique si la chaîne est <see langword="null"/> ou vide (<c>""</c> ou <see cref="string.Empty"/>).
        /// </summary>
        /// <param name="src">Chaîne à tester.</param>
        /// <returns><see langword="true"/> si la chaîne est <see langword="null"/> ou vide (<c>""</c>) ; sinon <see langword="false"/>.</returns>
        public static bool IsNullOrEmpty(this string src)
        {
            return string.IsNullOrEmpty(src);
        }

        /// <summary>
        /// Indique si la chaîne n'est pas <see langword="null"/> et non vide (<c>""</c> ou <see cref="string.Empty"/>).
        /// </summary>
        /// <param name="src">Chaîne à tester.</param>
        /// <returns><see langword="true"/> si la chaîne n'est pas <see langword="null"/> et non vide (<c>""</c>) ; sinon <see langword="false"/>.</returns>
        public static bool IsNotNullOrEmpty(this string src)
        {
            return !string.IsNullOrEmpty(src);
        }

        /// <summary>
        /// Indique si la chaîne est <see langword="null"/>, vide (<c>""</c> ou <see cref="string.Empty"/>) ou composée uniquement d'espaces.
        /// </summary>
        /// <param name="src">Chaîne à tester.</param>
        /// <returns><see langword="true"/> si la chaîne est <see langword="null"/>, vide (<c>""</c> ou <see cref="string.Empty"/>) ou composée uniquement d'espaces ; sinon <see langword="false"/>.</returns>
        public static bool IsNullOrWhiteSpace(this string src)
        {
            return string.IsNullOrWhiteSpace(src);
        }

        /// <summary>
        /// Indique si la chaîne n'est pas <see langword="null"/>, vide (<c>""</c> ou <see cref="string.Empty"/>) et composée uniquement d'espaces.
        /// </summary>
        /// <param name="src">Chaîne à tester.</param>
        /// <returns><see langword="true"/> si la chaîne n'est pas <see langword="null"/>, vide (<c>""</c> ou <see cref="string.Empty"/>) et composée uniquement d'espaces ; sinon <see langword="false"/>.</returns>
        public static bool IsNotNullOrWhiteSpace(this string src)
        {
            return !string.IsNullOrWhiteSpace(src);
        }
    }
}
