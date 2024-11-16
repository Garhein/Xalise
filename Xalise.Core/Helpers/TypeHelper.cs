using System;
using Xalise.Core.Exceptions;

namespace Xalise.Core.Helpers
{
    /// <summary>
    /// Fonctions utilitaires de manipulation des types de données.
    /// </summary>
    public static class TypeHelper
    {
        /// <summary>
        /// Récupère le nom du type de donnée à partir d'une instance d'un objet.        
        /// </summary>
        /// <param name="obj">Instance de l'objet à partir duquel récupérer le nom du type de données.</param>
        /// <exception cref="ArgumentNullException">Si <paramref name="obj"/> est <seealso langword="null"/>.</exception>
        /// <returns>Nom du type de donnée.</returns>
        public static string GetTypeName(Object obj)
        {
            if (obj == null)
            {
                throw new ArgumentNullException(nameof(obj), "Objet non valide.");
            }

            return TypeHelper.GetTypeName(obj.GetType());
        }

        /// <summary>
        /// Récupère le nom d'un type de données.
        /// </summary>
        /// <param name="type">Type de données à partir duquel récupérer le nom.</param>
        /// <exception cref="ArgumentNullException">Si <paramref name="type"/> est <seealso langword="null"/>.</exception>
        /// <exception cref="XaliseTypeException">Si le nom complet du type de données est <see lanword="null"/>, vide (<c>""</c>) ou composé uniquement d'espaces.</exception>
        /// <returns>Nom du type de donnée.</returns>
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
