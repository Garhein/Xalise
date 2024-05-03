using System;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;

namespace Xalise.Interop.HL7.Structure.DataType.Primitive
{
    /// <summary>
    /// SI - Sequence ID.
    /// </summary>
    /// <remarks>
    /// Entier non négatif de la forme d'un champ <see cref="NM"/>.
    /// </remarks>
    [Serializable]
    public class SI : AbstractTypePrimitive
    {
        /// <inheritdoc/>
        public SI(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <inheritdoc/>
        public SI(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(description, maxLength, usage, codeTable) { }
    }
}
