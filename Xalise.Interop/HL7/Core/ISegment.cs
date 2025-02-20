using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Enums;

namespace Xalise.Interop.HL7.Core
{
    /// <summary>
    /// Fonctionnalités des segments HL7.
    /// </summary>
    /// <author>Xavier VILLEMIN - xavier.villemin@gmail.com</author>
    public interface ISegment : IStructure
    {
        /// <summary>
        /// Nombre de champs composant le segment.
        /// </summary>
        int NumberOfFields { get; }

        /// <summary>
        /// Récupère les répétitions d'un champ.
        /// </summary>
        /// <remarks>
        /// Le tableau récupéré à une longueur de 1 si le champ n'est pas répétable.<br/>
        /// L'accès aux champs d'un segment est réalisé à partir de l'index 1.
        /// </remarks>
        /// <typeparam name="FType">Type du champ.</typeparam>
        /// <param name="fieldNumber">Index du champ.</param>
        /// <exception cref="HL7Exception">
        /// Si l'une des conditions suivantes est détectée :<br/>
        /// - <paramref name="fieldNumber"/> est inférieur ou égale à 0.<br/>
        /// - <paramref name="fieldNumber"/> est supérieur à <see cref="NumberOfFields"/>.
        /// </exception>
        /// <returns>Un tableau de type <typeparamref name="FType"/>.</returns>
        FType[] GetField<FType>(int fieldNumber) where FType : class, IType;

        /// <summary>
        /// Récupère une répétition d'un champ.
        /// </summary>
        /// <remarks>
        /// L'accès aux champs d'un segment et aux répétitions est réalisé à partir de l'index 1.
        /// </remarks>
        /// <typeparam name="FType">Type du champ.</typeparam>
        /// <param name="fieldNumber">Index du champ.</param>
        /// <param name="repNumber">Index de la répétition.</param>
        /// <exception cref="HL7Exception">
        /// Si l'une des conditions suivantes est détectée :<br/>
        /// - <paramref name="fieldNumber"/> est inférieur ou égal à 0.<br/>
        /// - <paramref name="fieldNumber"/> est supérieur à <see cref="NumberOfFields"/>.<br/>
        /// - <paramref name="repNumber"/> est supérieur au nombre maximal de répétitions autorisé pour le champ.
        /// </exception>
        /// <returns>Une répétition de type <typeparamref name="FType"/>.</returns>
        FType GetField<FType>(int fieldNumber, int repNumber) where FType : class, IType;

        /// <summary>
        /// Vérifie si la condition d'usage indiquée correspond à celle d'un champ.
        /// </summary>
        /// <remarks>
        /// L'accès aux champs d'un segment est réalisé à partir de l'index 1.
        /// </remarks>
        /// <param name="fieldNumber">Index du champ.</param>
        /// <param name="usage">Condition d'usage à vérifier.</param>
        /// <exception cref="HL7Exception">
        /// Si l'une des conditions suivantes est détectée :<br/>
        /// - <paramref name="fieldNumber"/> est inférieur ou égal à 0.<br/>
        /// - <paramref name="fieldNumber"/> est supérieur à <see cref="NumberOfFields"/>.
        /// </exception>
        /// <returns><see langword="true"/> si <paramref name="usage"/> correspond à celle du champ, sinon <see langword="false"/>.</returns>
        bool CheckUsage(int fieldNumber, EnumDataUsage usage);

        /// <summary>
        /// Retire une répétition d'un champ.
        /// </summary>
        /// <remarks>
        /// L'accès aux champs d'un segment et aux répétitions est réalisé à partir de l'index 1.
        /// </remarks>
        /// <param name="fieldNumber">Index du champ.</param>
        /// <param name="repNumber">Index de la répétition à retirer.</param>
        /// <exception cref="HL7Exception">
        /// Si l'une des conditions suivantes est détectée :<br/>
        /// - <paramref name="fieldNumber"/> est inférieur ou égal à 0.<br/>
        /// - <paramref name="fieldNumber"/> est supérieur à <see cref="NumberOfFields"/>.<br/>
        /// - <paramref name="repNumber"/> est inférieur ou égal à 0.<br/>
        /// - <paramref name="repNumber"/> est supérieur au nombre de répétitions du champ.
        /// </exception>
        void RemoveRepetition(int fieldNumber, int repNumber);

        /// <summary>
        /// Retire une répétition d'un champ.
        /// </summary>
        /// <remarks>
        /// L'accès aux champs d'un segment est réalisé à partir de l'index 1.
        /// </remarks>
        /// <param name="fieldNumber">Index du champ.</param>
        /// <param name="repToRemove">Répétition à retirer.</param>
        /// <exception cref="HL7Exception">
        /// Si l'une des conditions suivantes est détectée :<br/>
        /// - <paramref name="fieldNumber"/> est inférieur ou égal à 0.<br/>
        /// - <paramref name="fieldNumber"/> est supérieur à <see cref="NumberOfFields"/>.
        /// - le champ ne contient aucune répétition.<br/>
        /// - le champ ne contient pas la répétition à retirer.
        /// </exception>
        void RemoveRepetition(int fieldNumber, IType repToRemove);
    }
}