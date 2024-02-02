using System;

namespace Xalise.Interop.HL7.Exceptions
{
    /// <summary>
    /// Exceptions levées/interceptées au niveau de la gestion d'un message HL7.
    /// </summary>
    public class InteropHL7Exception : Exception
    {
        /// <summary>
        /// Constructeur vide.
        /// </summary>
        public InteropHL7Exception() { }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="message">Message de l'exception.</param>
        public InteropHL7Exception(string message) : base(message) { }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="message">Message de l'exception.</param>
        /// <param name="inner">Exception interne.</param>
        public InteropHL7Exception(string message, Exception inner) : base(message, inner) { }
    }
}
