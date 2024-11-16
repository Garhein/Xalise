using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;

namespace Xalise.Interop.HL7.Structure.DataType.Primitive
{
    /// <summary>
    /// NM - Numeric.
    /// </summary>
    /// <remarks>
    /// Nombre représenté sous la forme d'une série de caractères constituée : <br/>
    /// - d'un signe initial facultatif (+ ou -)<br/>
    /// - d'une série de chiffres<br/>
    /// - d'un point décimal facultatif<br/><br/>
    /// En l'absence de signe, le nombre est considéré comme étant positif.<br/>
    /// En l'absence de point décimal, le nombre est considéré comme étant un nombre entier.
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
