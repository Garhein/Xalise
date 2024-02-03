using System;
using System.Collections.Generic;
using System.Reflection;
using Xalise.Core.Helpers;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Exceptions;
using Xalise.Interop.HL7.Helpers;

namespace Xalise.Interop.HL7.Core
{
    /// <summary>
    /// Représentation d'un segment.
    /// </summary>
    [Serializable]
    public class AbstractSegment : ISegment
    {
        private List<SegmentItem> _items;

        /// <summary>
        /// Constructeur par défaut.
        /// </summary>
        public AbstractSegment()
        { 
            this._items = new List<SegmentItem>();
        }

        /// <summary>
        /// Initialise un champ du segment.
        /// </summary>
        /// <param name="type">Type du champ.</param>
        /// <param name="description">Description du champ.</param>
        /// <param name="maxLength">Longueur maximale de chaque répétition.</param>
        /// <param name="maxRepetitions">Nombre maximum de répétitions autorisées.</param>
        /// <param name="usage">Condition d'usage du champ.</param>
        /// <exception cref="InteropHL7Exception">Si <paramref name="type"/> n'hérite pas de <seealso cref="IType"/>.</exception>
        protected void InitField(Type type, string description, int maxLength, int maxRepetitions, EnumDataUsage usage)
        {
            this.InitField(type, description, maxLength, maxRepetitions, usage, 0);
        }

        /// <summary>
        /// Initialise un champ du segment.
        /// </summary>
        /// <param name="type">Type du champ.</param>
        /// <param name="description">Description du champ.</param>
        /// <param name="maxLength">Longueur maximale de chaque répétition.</param>
        /// <param name="maxRepetitions">Nombre maximum de répétitions autorisées.</param>
        /// <param name="usage">Condition d'usage du champ.</param>
        /// <param name="codeTable">Code de la table de donnée associée.</param>
        /// <exception cref="InteropHL7Exception">Si <paramref name="type"/> n'hérite pas de <seealso cref="IType"/>.</exception>
        protected void InitField(Type type, string description, int maxLength, int maxRepetitions, EnumDataUsage usage, int codeTable)
        {
            if (!typeof(IType).IsAssignableFrom(type))
            {
                throw new InteropHL7Exception($"Le type '{type.FullName}' n'hérite pas de '{typeof(IType).FullName}'.");
            }

            this._items.Add(new SegmentItem(type, description, maxLength, maxRepetitions, usage, codeTable));
        }

        /// <inheritdoc/>
        public string SegmentName
        { 
            get
            {
                return TypeHelper.GetTypeName(this);
            }
        }

        /// <inheritdoc/>
        public IType[] GetField(int fieldNumber)
        {
            this.CheckFieldNumber(fieldNumber);

            return this._items[fieldNumber - 1].ConvertRepetitionsToITypeArray();
        }

        /// <inheritdoc/>
        public IType GetField(int fieldNumber, int repNumber)
        {
            this.CheckFieldNumber(fieldNumber, repNumber);

            int currentRep = this._items[fieldNumber - 1].Repetitions.Count;

            // Création d'une répétition si nécessaire et si la limite maximale n'est pas atteinte
            if (repNumber > currentRep)
            {
                if (repNumber > this._items[fieldNumber - 1].MaxRepetitions)
                {
                    throw new InteropHL7Exception($"Impossible d'ajouter la répétition {FieldHelper.ConstructFieldNumber(this.SegmentName, fieldNumber, repNumber)} : le nombre maximal autorisé de répétition est de {this._items[fieldNumber - 1].MaxRepetitions}.");
                }
                else
                {
                    this._items[fieldNumber - 1].Repetitions.Add(this.CreateNewField(fieldNumber));
                }
            }

            return this._items[fieldNumber - 1].Repetitions[repNumber - 1];
        }

        /// <inheritdoc/>
        public int GetTotalFieldRepetitions(int fieldNumber)
        {
            this.CheckFieldNumber(fieldNumber);

            return this._items[fieldNumber - 1].Repetitions.Count;
        }

        /// <summary>
        /// Vérifie si le champ auquel on souhaite accéder est valide.
        /// </summary>
        /// <param name="fieldNumber">Numéro du champ.</param>
        /// <param name="repNumber">Numéro de la répétition.</param>
        /// <exception cref="InteropHL7Exception">
        /// Exception levée si l'une des conditions suivantes est vérifiée :<br/>
        /// <ul>
        /// <list type="-"><paramref name="fieldNumber"/> est inférieur ou égal à 0.</list>
        /// <list type="-">Si le champ n'existe pas.</list>
        /// <list type="-"><paramref name="repNumber"/> est inférieur ou égal à 0.</list>
        /// </ul>
        /// </exception>
        private void CheckFieldNumber(int fieldNumber, int? repNumber = null)
        {
            if (fieldNumber <= 0)
            {
                throw new InteropHL7Exception($"L'accès à un champ doit être réalisé à partir de l'index 1 (index utilisé : {fieldNumber}.");
            }

            if (fieldNumber > this._items.Count)
            {
                throw new InteropHL7Exception($"Impossible d'accéder au champ {FieldHelper.ConstructFieldNumber(this.SegmentName, fieldNumber)} : il n'y a que {this._items.Count} champs dans le segment.");
            }

            if (repNumber.HasValue)
            {
                if (repNumber.Value <= 0)
                {
                    throw new InteropHL7Exception($"L'accès à un une répétition d'un champ doit être réalisé à partir de l'index 1 (index utilisé : {repNumber}).");
                }
            }
        }
    
        /// <summary>
        /// Création d'un champ.
        /// </summary>
        /// <param name="fieldNumber">Numéro du champ auquel ajouter la répétition.</param>
        /// <returns>Une instance <seealso cref="IType"/> représentant le champ.</returns>
        /// <exception cref="InteropHL7Exception">Si une erreur est détectée à la création du champ.</exception>
        private IType CreateNewField(int fieldNumber)
        {
            IType newType       = null;
            Type typeRep        = this._items[fieldNumber - 1].Type;
            string descr        = this._items[fieldNumber - 1].Description;
            int maxLength       = this._items[fieldNumber - 1].MaxLength;
            EnumDataUsage usage = this._items[fieldNumber - 1].Usage;
            int codeTable       = this._items[fieldNumber - 1].CodeTable;

            try
            {
                Object[] args    = new Object[4] { descr, maxLength, usage, codeTable };
                Type[] argsTypes = new Type[4] { descr.GetType(), maxLength.GetType(), usage.GetType(), codeTable.GetType() };
                newType          = (IType)typeRep.GetConstructor(argsTypes).Invoke(args);
            }
            catch (UnauthorizedAccessException authAccessEx)
            {
                throw new InteropHL7Exception($"Impossible d'accéder à la classe '{typeRep.FullName}' ({authAccessEx.GetType().FullName}) : {authAccessEx.Message}", authAccessEx);
            }
            catch (TargetInvocationException targetIncovationEx)
            {
                throw new InteropHL7Exception($"Impossible d'instancier la classe '{typeRep.FullName}' ({targetIncovationEx.GetType().FullName}) : {targetIncovationEx.Message}", targetIncovationEx);
            }
            catch (MethodAccessException methodAccessEx)
            {
                throw new InteropHL7Exception($"Impossible d'instancier la classe '{typeRep.FullName}' ({methodAccessEx.GetType().FullName}) : {methodAccessEx.Message}", methodAccessEx);
            }
            catch (Exception ex)
            {
                throw new InteropHL7Exception($"Impossible d'instancier la classe '{typeRep.FullName}' ({ex.GetType().FullName}) : {ex.Message}", ex);
            }

            return newType;
        }
    }
}
