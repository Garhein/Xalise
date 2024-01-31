using System;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;

namespace Xalise.Interop.HL7.Structure.DataType.Primitive
{
    /// <summary>
    /// TX - Text Data.
    /// </summary>
    [Serializable]
    public class TX : AbstractTypePrimitive
    {
        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        public TX(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        /// <param name="codeTable">Code de la table de donnée associée</param>
        public TX(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(description, maxLength, usage, codeTable) { }
    }
}
