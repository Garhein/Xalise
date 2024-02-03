using Xalise.Interop.HL7.Exceptions;

namespace Xalise.Interop.HL7.Core
{
    /// <summary>
    /// Déclaration des comportements communs aux segments des messages HL7.
    /// </summary>
    public interface ISegment
    {
        /// <summary>
        /// Récupère le nom du segment (exemple : MSH).
        /// </summary>
        string SegmentName { get; }

        /// <summary>
        /// Récupère les données d'un champ du segment.<br/>
        /// Le tableau de <seealso cref="IType"/> retourné a une longueur de 1 dans le cas d'un champ non répétable. 
        /// </summary>
        /// <remarks>
        /// Les champs sont numérotés à partir de 1.
        /// </remarks>
        /// <param name="fieldNumber">Numéro du champ.</param>
        /// <returns>Tableau de <see cref="IType"/>.</returns>
        IType[] GetField(int fieldNumber);

        /// <summary>
        /// Récupère une répétition d'un champ du segment.
        /// </summary>
        /// <remarks>
        /// Les champs et répétitions sont numéroté(e)s à partir de 1.
        /// </remarks>
        /// <param name="fieldNumber">Numéro du champ.</param>
        /// <param name="repNumber">Numéro de la répétition.</param>
        /// <exception cref="InteropHL7Exception">Si le nombre maximum autorisé de répétition est atteint lorsque l'on tente d'ajouter automatiquement une répétition.</exception>
        /// <returns>Instance de <seealso cref="IType"/> représentant la répétition.</returns>
        IType GetField(int fieldNumber, int repNumber);

        int GetTotalFieldRepetitions(int fieldNumber);
    }
}
