﻿using System;
using Xalise.Core.Helpers;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;

namespace Xalise.Interop.HL7.Structure.DataType.Primitive
{
    /// <summary>
    /// NM - Numeric.
    /// </summary>
    /// <remarks>
    /// Nombre représenté sous la forme d'une série de caractères numériques, composé :<br/>
    ///  - d'un signe arithmétique facultatif (<seealso cref="NumberHelper.CSTS_DEFAULT_POSITIVE_SIGN"/> ou <seealso cref="NumberHelper.CSTS_DEFAULT_NEGATIVE_SIGN"/>)<br/>
    ///  - de chiffres<br/>
    ///  - d'un point décimal facultatif<br/>
    /// En l'absence de signe, le nombre est supposé positif.<br/>
    /// S'il n'y a pas de point décimal, le nombre est supposé être un entier.
    /// </remarks>
    [Serializable]
    public class NM : AbstractTypePrimitive
    {
        /// <inheritdoc/>
        public NM(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <inheritdoc/>
        public NM(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(description, maxLength, usage, codeTable) { }
    }
}
