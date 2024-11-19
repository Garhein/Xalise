namespace Xalise.Interop.HL7.Core
{
    /// <summary>
    /// Fonctionnalités des types de données HL7.
    /// </summary>
    /// <author>Xavier VILLEMIN - xavier.villemin@gmail.com</author>
    public interface IType
    {
        /// <summary>
        /// Nom du type de données.
        /// </summary>
        string TypeName { get; }
    }
}