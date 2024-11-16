namespace Xalise.Interop.HL7.Core
{
    /// <summary>
    /// Déclaration des fonctionnalités commune à l'ensemble des types de données primitifs.
    /// </summary>
    /// <remarks>
    /// Un type primitif contient une valeur unique, c'est-à-dire qu'il ne contient pas de sous composants.<br/>
    /// Exemples : ST et ID.
    /// </remarks>
    public interface ITypePrimitive
    {
        /// <summary>
        /// Valeur du type de données.
        /// </summary>
        string Value { get; set; }
    }
}