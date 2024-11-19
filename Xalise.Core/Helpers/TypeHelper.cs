using System;
using Xalise.Core.Exceptions;

namespace Xalise.Core.Helpers
{
    /// <summary>
    /// Fonctions de manipulation associées aux types.
    /// </summary>
    /// <author>Xavier VILLEMIN - xavier.villemin@gmail.com</author>
    public static class TypeHelper
    {
        /// <summary>
        /// Récupère le nom du type d'un objet, sans qualification du package, à partir d'une instance.
        /// </summary>
        /// <remarks>
        /// Exemple : l'exécution depuis une instance du <c>type Xalise.Core.ExampleType</c> retourne la valeur <c>ExampleType</c>.
        /// </remarks>
        /// <param name="obj">Instance de l'objet à partir de laquelle le nom est récupéré.</param>
        /// <returns>Le nom du type.</returns>
        /// <exception cref="ArgumentNullException">Si <paramref name="obj"/> est <see langword="null"/>.</exception>
        public static string GetTypeName(Object obj)
        {
            if (obj == null)
            {
                throw new ArgumentNullException(nameof(obj), "Objet non valide.");
            }

            return TypeHelper.GetTypeName(obj.GetType());
        }

        /// <summary>
        /// Récupère le nom d'un type, sans qualification du package.
        /// </summary>
        /// <remarks>
        /// Exemple : l'exécution depuis <c><see langword="typeof"/>(Xalise.Core.ExampleType)</c> retourne la valeur <c>ExampleType</c>.
        /// </remarks>
        /// <param name="type">Type à partir duquel le nom est récupéré.</param>
        /// <exception cref="ArgumentNullException">Si <paramref name="type"/> est <see langword="null"/>.</exception>
        /// <exception cref="XaliseTypeException">Si <see cref="Type.FullName"/> est <see langword="null"/>, vide (<c>""</c>) ou composé uniquement d'espaces.</exception>
        /// <returns>Le nom du type.</returns>
        public static string GetTypeName(Type type)
        {
            if (type == null)
            {
                throw new ArgumentNullException(nameof(type), "Type de données non valide.");
            }

            string className = string.Empty;

            if (!string.IsNullOrWhiteSpace(type.FullName))
            {
                className = type.FullName;
                className = className.Substring(className.LastIndexOf('.') + 1);
            }
            else
            {
                throw new XaliseTypeException("Nom complet du type de données non valide.");
            }
            
            return className;
        }
    }
}
