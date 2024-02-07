using Xalise.Interop.HL7.Enums;
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

        /// <summary>
        /// Récupère le nombre de répétition d'un champ.
        /// </summary>
        /// <remarks>
        /// Les champs sont numérotés à partir de 1.
        /// </remarks>
        /// <param name="fieldNumber">Numéro du champ.</param>
        /// <returns>Nombre de répétition.</returns>
        int GetTotalFieldRepetitions(int fieldNumber);

        /// <summary>
        /// Récupère la description d'un champ.
        /// </summary>
        /// <remarks>
        /// Les champs sont numérotés à partir de 1.
        /// </remarks>
        /// <param name="fieldNumber">Numéro du champ.</param>
        /// <returns>Description du champ.</returns>
        string GetFieldDescription(int fieldNumber);

        /// <summary>
        /// Récupère l'usage d'un champ.
        /// </summary>
        /// <remarks>
        /// Les champs sont numérotés à partir de 1.
        /// </remarks>
        /// <param name="fieldNumber">Numéro du champ.</param>
        /// <returns><seealso cref="EnumDataUsage"/> représentant l'usage du champ.</returns>
        EnumDataUsage GetFieldUsage(int fieldNumber);

        /// <summary>
        /// Récupère la longueur maximale de chaque répétition d'un champ.
        /// </summary>
        /// <remarks>
        /// Les champs sont numérotés à partir de 1.
        /// </remarks>
        /// <param name="fieldNumber">Numéro du champ.</param>
        /// <returns>Longueur maximal de chaque répétition.</returns>
        int GetFieldMaxLength(int fieldNumber);

        /// <summary>
        /// Récupère le nombre maximum de répétition d'un champ.
        /// </summary>
        /// <remarks>
        /// Les champs sont numérotés à partir de 1.
        /// </remarks>
        /// <param name="fieldNumber">Numéro du champ.</param>
        /// <returns>Nombre maximum de répétition.</returns>
        int GetFieldMaxRepetitions(int fieldNumber);

        /// <summary>
        /// Récupère le code de la table de donnée associée à un champ.
        /// </summary>
        /// <remarks>
        /// Les champs sont numérotés à partir de 1.
        /// </remarks>
        /// <param name="fieldNumber">Numéro du champ.</param>
        /// <returns>Code de la table de donnée.</returns>
        int GetFieldCodeTable(int fieldNumber);
    }
}
