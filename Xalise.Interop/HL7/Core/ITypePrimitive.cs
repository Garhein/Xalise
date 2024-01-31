namespace Xalise.Interop.HL7.Core
{
    /// <summary>
    /// Déclaration des comportements communs aux types de données primitifs.
    /// </summary>
    /// <remarks>
    /// Un type primitif contient une valeur unique, c'est-à-dire qu'il ne contient pas de sous-composants.<br/>
    /// Exemples : ST et ID.
    /// </remarks>
    public interface ITypePrimitive
    {
        /// <summary>
        /// Affecte et récupère la valeur du type de donnée.
        /// </summary>
        string Value { get; set; }
    }
}
