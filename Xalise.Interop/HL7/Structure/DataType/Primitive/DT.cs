using System;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;

namespace Xalise.Interop.HL7.Structure.DataType.Primitive
{
    /// <summary>
    /// DT - Date.
    /// </summary>
    /// <remarks>
    /// Le siècle et l'année sont obligatoires, tandis que le mois et le jour sont facultatifs.
    /// </remarks>
    [Serializable]
    public class DT : AbstractTypePrimitive
    {
        /// <inheritdoc/>
        public DT(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <inheritdoc/>
        public DT(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(description, maxLength, usage, codeTable) { }
    }
}
