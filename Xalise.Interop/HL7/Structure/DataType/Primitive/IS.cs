using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;

namespace Xalise.Interop.HL7.Structure.DataType.Primitive
{
    /// <summary>
    /// IS - Coded value for user-defined tables.
    /// </summary>
    /// <author>Xavier VILLEMIN - xavier.villemin@gmail.com</author>
    [Serializable]
    public class IS : AbstractTypePrimitive
    {
        /// <inheritdoc/>
        public IS(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <inheritdoc/>
        public IS(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(description, maxLength, usage, codeTable) { }
    }
}
