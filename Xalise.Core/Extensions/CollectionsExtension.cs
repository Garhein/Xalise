namespace Xalise.Core.Extensions
{
    /// <summary>
    /// Méthodes d'extension applicables aux <see cref="IEnumerable{T}"/> et <see cref="IDictionary{TKey, TValue}"/>.
    /// </summary>
    public static class CollectionsExtension
    {
        /// <summary>
        /// Vérifie si la collection est <see langword="null"/> ou ne contient aucune valeur.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="src">Collection à tester.</param>
        /// <returns><see langword="true"/> si <paramref name="src"/> est <see langword="null"/> ou ne contient aucune valeur ; sinon <see langword="false"/>.</returns>
        public static bool IsEmpty<T>(this IEnumerable<T> src)
        {
            return src == null || !src.Any();
        }

        /// <summary>
        /// Vérifie si la collection n'est pas <see langword="null"/> et contient au moins une valeur.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="src">Collection à tester.</param>
        /// <returns><see langword="true"/> si <paramref name="src"/> n'est pas <see langword="null"/> et contient au moins une valeur ; sinon <see langword="false"/>.</returns>
        public static bool IsNotEmpty<T>(this IEnumerable<T> src)
        {
            return !src.IsEmpty();
        }
    }
}
