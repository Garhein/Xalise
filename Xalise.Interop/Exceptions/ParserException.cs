namespace Xalise.Interop.Exceptions
{
    /// <summary>
    /// Erreur détectée ou levée au niveau de l'encodage d'un élément (message, segment, type).
    /// </summary>
    /// <author>Xavier VILLEMIN - xavier.villemin@gmail.com</author>
    public class ParserException : Exception
    {
        /// <inheritdoc/>
        public ParserException() { }

        /// <inheritdoc/>
        public ParserException(string message) : base(message) { }

        /// <inheritdoc/>
        public ParserException(string message, Exception inner) : base(message, inner) { }
    }
}
