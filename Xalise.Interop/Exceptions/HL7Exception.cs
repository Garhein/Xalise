namespace Xalise.Interop.Exceptions
{
    /// <summary>
    /// Erreur détectée ou levée au niveau de la gestion d'un message HL7.
    /// </summary>
    /// <author>Xavier VILLEMIN - xavier.villemin@gmail.com</author>
    public class HL7Exception : Exception
    {
        /// <inheritdoc/>
        public HL7Exception() { }

        /// <inheritdoc/>
        public HL7Exception(string message) : base(message) { }

        /// <inheritdoc/>
        public HL7Exception(string message, Exception inner) : base(message, inner) { }
    }
}
