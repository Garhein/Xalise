using System;

namespace Xalise.Core.Exceptions
{
    /// <summary>
    /// Représente une erreur détectée ou levée au niveau de la gestion d'un type de donnée.
    /// </summary>
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
