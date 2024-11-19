using System;

namespace Xalise.Core.Exceptions
{
    /// <summary>
    /// Erreur détectée ou levée au niveau de la gestion d'un type de données.
    /// </summary>
    /// <author>Xavier VILLEMIN - xavier.villemin@gmail.com</author>
    public class XaliseTypeException : Exception
    {
        /// <inheritdoc/>
        public XaliseTypeException() { }

        /// <inheritdoc/>
        public XaliseTypeException(string message) : base(message) { }

        /// <inheritdoc/>
        public XaliseTypeException(string message, Exception inner) : base(message, inner) { }
    }
}
