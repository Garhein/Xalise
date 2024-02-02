namespace Xalise.Interop.HL7.Core
{
    /// <summary>
    /// Déclaration des comportements communs aux types de données composites.
    /// </summary>
    /// <remarks>
    /// Un type composite contient plusieurs composants.<br/>
    /// Exemples : <seealso cref="Structure.DataType.Composite.CE"/>.
    /// </remarks>
    public interface ITypeComposite
    {
        /// <summary>
        /// Récupère un tableau représentant les composants du type de donnée.
        /// </summary>
        IType[] Components { get; }

        /// <summary>
        /// Affecte et récupère un composant précis du type de donnée.
        /// </summary>
        /// <remarks>
        /// Une base 1 est utilisée pour tous les accès aux composants.
        /// </remarks>
        /// <param name="index">Index du composant à affecter ou récupérer.</param>
        /// <returns>Composant de type <see cref="IType"/>.</returns>
        /// <exception cref="InteropHL7Exception">Si <paramref name="index"/> est inférieur ou égal à 0 où que le composant n'existe pas pour l'index spécifié.</exception>
        IType this[int index] { get; set; }
    }
}
