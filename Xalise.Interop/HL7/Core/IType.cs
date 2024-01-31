namespace Xalise.Interop.HL7.Core
{
    /// <summary>
    /// Déclaration des comportements communs aux types de données HL7.
    /// </summary>
    public interface IType
    {
        /// <summary>
        /// Récupère le nom du type de donnée.
        /// </summary>
        string TypeName { get; }
    }
}
