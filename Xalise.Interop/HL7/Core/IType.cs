namespace Xalise.Interop.HL7.Core
{
    /// <summary>
    /// Déclaration des fonctionnalités commune à l'ensemble des types de données HL7.
    /// </summary>
    public interface IType
    {
        /// <summary>
        /// Récupère le nom du type de données.
        /// </summary>
        string TypeName { get; }
    }
}
