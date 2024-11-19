﻿using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;

namespace Xalise.Interop.HL7.Structure.DataType.Primitive
{
    /// <summary>
    /// DTM - Date/time.
    /// </summary>
    /// <remarks>
    /// Notation sur 24 heures.<br/>
    /// Formats autorisés : YYYY[MM[DD[HH[MM[SS]]]]].
    /// </remarks>
    /// <author>Xavier VILLEMIN - xavier.villemin@gmail.com</author>
    [Serializable]
    public class DTM : AbstractTypePrimitive
    {
        /// <inheritdoc/>
        public DTM(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <inheritdoc/>
        public DTM(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(description, maxLength, usage, codeTable) { }
    }
}
