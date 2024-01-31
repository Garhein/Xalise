namespace Xalise.Core.Helpers
{
    /// <summary>
    /// Fonctions utilitaires pour manipuler les types de données.
    /// </summary>
    public static class TypeHelper
    {
        /// <summary>
        /// Récupère le nom du type d'une instance d'un objet.        
        /// </summary>
        /// <param name="obj">Instance pour laquelle récupérer le nom.</param>
        /// <exception cref="ArgumentNullException">Si <paramref name="obj"/> est <seealso langword="null"/>.</exception>
        /// <returns>Nom du type de l'instance de <paramref name="obj"/>.</returns>
        public static string GetTypeName(Object obj)
        {
            ArgumentHelper.ThrowIfNull(obj, nameof(obj));

            return TypeHelper.GetTypeName(obj.GetType());
        }

        /// <summary>
        /// Récupère le nom d'un type.
        /// </summary>
        /// <param name="type">Type pour lequel récupérer le nom.</param>
        /// <exception cref="ArgumentNullException">Si <paramref name="type"/> est <seealso langword="null"/>.</exception>
        /// <returns>Nom du type <paramref name="type"/>.</returns>
        public static string GetTypeName(Type type)
        {
            ArgumentHelper.ThrowIfNull(type, nameof(type));

            string className = type.FullName;
            return className.Substring(className.LastIndexOf('.') + 1);
        }
    }
}
