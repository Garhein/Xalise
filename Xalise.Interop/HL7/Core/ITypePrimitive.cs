using Xalise.Interop.HL7.Structure.DataType.Primitive;

namespace Xalise.Interop.HL7.Core
{
    /// <summary>
    /// Fonctionnalités des types de données primitifs.
    /// </summary>
    /// <remarks>
    /// Un type primitif contient une valeur unique, c'est-à-dire qu'il ne contient pas de sous composants.<br/>
    /// Exemples : <see cref="ST"/> ou <see cref="ID"/>.
    /// </remarks>
    /// <author>Xavier VILLEMIN - xavier.villemin@gmail.com</author>
    public interface ITypePrimitive
    {
        /// <summary>
        /// Valeur du type de données.
        /// </summary>
        string Value { get; set; }
    }
}