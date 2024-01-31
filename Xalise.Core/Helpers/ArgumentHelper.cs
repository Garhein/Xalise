using Xalise.Core.Extensions;

namespace Xalise.Core.Helpers
{
    /// <summary>
    /// Fonctions utilitaires pour manipuler les paramètres d'appel des méthodes.
    /// </summary>
    public static class ArgumentHelper
    {
        #region NULL/Empty

        /// <summary>
        /// Vérifie si <paramref name="value"/> est <seealso langword="null"/>.
        /// </summary>
        /// <param name="value">Valeur du paramètre.</param>
        /// <param name="parameterName">Nom du paramètre.</param>
        /// <exception cref="ArgumentNullException">Si <paramref name="value"/> est <seealso langword="null"/>.</exception>
        public static void ThrowIfNull(object value, string parameterName)
        {
            if (value == null)
            {
                throw new ArgumentNullException($"Le paramètre '{parameterName}' ne peut pas être NULL.");
            }
        }

        /// <summary>
        /// Vérifie si <paramref name="value"/> est <seealso langword="null"/>.
        /// </summary>
        /// <param name="value">Valeur du paramètre.</param>
        /// <param name="parameterName">Nom du paramètre.</param>
        /// <exception cref="ArgumentNullException">Si <paramref name="value"/> est <seealso langword="null"/>.</exception>
        /// <exception cref="ArgumentException">Si <paramref name="value"/> est vide.</exception>
        public static void ThrowIfNullOrEmpty(string value, string parameterName)
        {
            ArgumentHelper.ThrowIfNull(value, parameterName);

            if (value.IsNullOrEmpty())
            {
                throw new ArgumentException($"Le paramètre '{parameterName}' ne peut pas être une chaîne vide.");
            }
        }

        /// <summary>
        /// Vérifie si le paramètre est NULL, vide (<c>""</c> ou <see cref="string.Empty"/>) ou composé uniquement d'espaces.
        /// </summary>
        /// <param name="value">Valeur du paramètre.</param>
        /// <param name="parameterName">Nom du paramètre.</param>
        /// <exception cref="ArgumentNullException">Si <paramref name="value"/> est <seealso langword="null"/>.</exception>
        /// <exception cref="ArgumentException">Si <paramref name="value"/> est vide (<c>""</c> ou <see cref="string.Empty"/>) ou composé uniquement d'espaces.</exception>
        public static void ThrowIfNullOrWhiteSpace(string value, string parameterName)
        {
            ArgumentHelper.ThrowIfNull(value, parameterName);

            if (value.IsNullOrWhiteSpace())
            {
                throw new ArgumentException($"Le paramètre '{parameterName}' ne peut pas être vide ou composé uniquement d'espaces.");
            }
        }

        #endregion
    }
}
