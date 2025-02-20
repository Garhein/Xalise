using System.Reflection;
using Xalise.Core.Helpers;
using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Helpers;

namespace Xalise.Interop.HL7.Core
{
    /// <summary>
    /// Segments HL7.
    /// </summary>
    /// <author>Xavier VILLEMIN - xavier.villemin@gmail.com</author>
    [Serializable]
    public abstract class AbstractSegment : ISegment
    {
        private List<SegmentItem> _items;

        /// <summary>
        /// Constructeur par défaut.
        /// </summary>
        public AbstractSegment() 
        {
            this._items = new List<SegmentItem>();
        }

        /// <inheritdoc/>
        public string StructureName => TypeHelper.GetTypeName(this);

        /// <inheritdoc/>
        public int NumberOfFields => this._items.Count;

        /// <inheritdoc/>
        public FType[] GetField<FType>(int fieldNumber) where FType : class, IType
        {
            this.CheckValidityOfIndexes(fieldNumber);

            return this[fieldNumber].ConvertRepetitionsToITypeArray<FType>();
        }

        /// <inheritdoc/>
        public FType GetField<FType>(int fieldNumber, int repNumber) where FType : class, IType
        {
            this.CheckValidityOfIndexes(fieldNumber);
            
            int currentRep = this[fieldNumber].Repetitions.Count;

            // Création d'une répétition si nécessaire et si la limite maximale n'est pas atteinte
            if (repNumber > currentRep)
            {
                if (repNumber > this[fieldNumber].MaxRepetitions)
                {
                    throw new HL7Exception($"Impossible d'ajouter la répétition {FieldHelper.ConstructFieldNumber(this.StructureName, fieldNumber, repNumber)} : le nombre maximal autorisé de répétition est de {this[fieldNumber].MaxRepetitions}.");
                }
                else
                {
                    this[fieldNumber].Repetitions.Add(this.CreateNewField(fieldNumber));
                }
            }

            return (FType)this[fieldNumber][repNumber];
        }

        /// <inheritdoc/>
        public bool CheckUsage(int fieldNumber, EnumDataUsage usage)
        {
            this.CheckValidityOfIndexes(fieldNumber);

            return this[fieldNumber].Usage == usage;
        }

        /// <inheritdoc/>
        public void RemoveRepetition(int fieldNumber, int repNumber)
        {
            this.CheckValidityOfIndexes(fieldNumber, repNumber);

            this[fieldNumber].Repetitions.RemoveAt(repNumber - 1);
        }

        /// <inheritdoc/>
        public void RemoveRepetition(int fieldNumber, IType repToRemove)
        {
            this.CheckValidityOfIndexes(fieldNumber);

            if (this[fieldNumber].Repetitions.Count == 0)
            {
                throw new HL7Exception($"Impossible de retirer une répétition du champ {FieldHelper.ConstructFieldNumber(this.StructureName, fieldNumber)} : la structure ne contient aucune répétition.");
            }

            if (!this[fieldNumber].Repetitions.Contains(repToRemove))
            {
                throw new HL7Exception($"Impossible de retirer la répétition du champ {FieldHelper.ConstructFieldNumber(this.StructureName, fieldNumber)} : la structure ne contient pas la répétition à retirer.");
            }

            this[fieldNumber].Repetitions.Remove(repToRemove);
        }

        /// <summary>
        /// Ajout d'un champ.
        /// </summary>
        /// <param name="type">Type du champ.</param>
        /// <param name="description">Description du champ.</param>
        /// <param name="maxLength">Longueur maximale du champ.</param>
        /// <param name="maxRepetitions">Nombre maximum de répétitions du champ.</param>
        /// <param name="usage">Condition d'usage du champ.</param>
        /// <exception cref="HL7Exception">Si <paramref name="type"/> n'hérite pas de <see cref="IType"/>.</exception>
        protected void AddField(Type type, string description, int maxLength, int maxRepetitions, EnumDataUsage usage)
        {
            this.AddField(type, description, maxLength, maxRepetitions, usage, 0);
        }

        /// <summary>
        /// Ajout d'un champ.
        /// </summary>
        /// <param name="type">Type du champ.</param>
        /// <param name="description">Description du champ.</param>
        /// <param name="maxLength">Longueur maximale du champ.</param>
        /// <param name="maxRepetitions">Nombre maximum de répétitions du champ.</param>
        /// <param name="usage">Condition d'usage du champ.</param>
        /// <param name="codeTable">Code de la table de données associée au champ.</param>
        /// <exception cref="HL7Exception">Si <paramref name="type"/> n'hérite pas de <see cref="IType"/>.</exception>
        protected void AddField(Type type, string description, int maxLength, int maxRepetitions, EnumDataUsage usage, int codeTable)
        {
            if (!typeof(IType).IsAssignableFrom(type))
            {
                throw new HL7Exception($"Le type de données '{type.FullName}' n'hérite pas de '{typeof(IType).FullName}'.");
            }

            this._items.Add(new SegmentItem(type, description, maxLength, maxRepetitions, usage, codeTable));
        }

        /// <summary>
        /// Récupère un champ.
        /// </summary>
        /// <remarks>
        /// L'accès aux champs d'un segment est réalisé à partir de l'index 1.
        /// </remarks>
        /// <param name="index">Index du champ à récupérer.</param>
        /// <exception cref="HL7Exception">
        /// Si l'une des conditions suivantes est détectée :<br/>
        /// - <paramref name="index"/> est inférieur ou égal à 0.<br/>
        /// - <paramref name="index"/> est supérieur à <see cref="NumberOfFields"/>.
        /// </exception>
        /// <returns>Un champ de type <see cref="SegmentItem"/>.</returns>
        private SegmentItem this[int index]
        {
            get
            {
                this.CheckValidityOfIndexes(index);

                return this._items[index - 1];
            }
        }

        /// <summary>
        /// Vérifie si les numéros de champ et de répétition sont valides et existent.
        /// </summary>
        /// <remarks>
        /// L'accès aux champs d'un segment et aux répétitions est réalisé à partir de l'index 1.
        /// </remarks>
        /// <param name="fieldNumber">Index du champ.</param>
        /// <param name="repNumber">Index de la répétition.</param>
        /// <exception cref="HL7Exception">
        /// Si l'une des conditions suivantes est détectée :<br/>
        /// - <paramref name="fieldNumber"/> est inférieur ou égal à 0.<br/>
        /// - <paramref name="fieldNumber"/> est supérieur à <see cref="NumberOfFields"/>.<br/>
        /// - <paramref name="repNumber"/> n'est pas <see langword="null"/> et est inférieur ou égal à 0.<br/>
        /// - <paramref name="repNumber"/> n'est pas <see langword="null"/> et est supérieur au nombre de répétitions du champ.
        /// </exception>
        private void CheckValidityOfIndexes(int fieldNumber, int? repNumber = null)
        {
            if (fieldNumber <= 0)
            {
                throw new HL7Exception($"L'accès à un champ doit être réalisé à partir de l'index 1 (index utilisé : {fieldNumber}).");
            }

            if (fieldNumber > this.NumberOfFields)
            {
                throw new HL7Exception($"Impossible d'accéder au champ {FieldHelper.ConstructFieldNumber(this.StructureName, fieldNumber)} : le segment contient {this.NumberOfFields} champs.");
            }

            if (repNumber.HasValue)
            {
                if (repNumber.Value <= 0)
                {
                    throw new HL7Exception($"L'accès à une répétition d'un champ doit être réalisé à partir de l'index 1 (index utilisé : {repNumber}).");
                }
                
                if (repNumber.Value > this[fieldNumber].Repetitions.Count)
                {
                    throw new HL7Exception($"Impossible d'accéder au champ {FieldHelper.ConstructFieldNumber(this.StructureName, fieldNumber, repNumber.Value)} : le champ contient {this[fieldNumber].Repetitions.Count} répétitions.");
                }
            }
        }

        /// <summary>
        /// Création d'une nouvelle instance d'un champ.
        /// </summary>
        /// <remarks>
        /// L'accès aux champs d'un segment est réalisé à partir de l'index 1.
        /// </remarks>
        /// <param name="fieldNumber">Index du champ.</param>
        /// <returns>Un champ de type <see cref="IType"/>.</returns>
        /// <exception cref="HL7Exception">Si une erreur survient à la création de l'instance.</exception>
        private IType CreateNewField(int fieldNumber)
        {
            this.CheckValidityOfIndexes(fieldNumber);

            IType newType       = null;
            Type typeRep        = this[fieldNumber].Type;
            string descr        = this[fieldNumber].Description;
            int maxLength       = this[fieldNumber].MaxLength;
            EnumDataUsage usage = this[fieldNumber].Usage;
            int codeTable       = this[fieldNumber].CodeTable;

            try
            {
                Object[] args   = new Object[4] { descr, maxLength, usage, codeTable };
                Type[] argsType = new Type[4] { descr.GetType(), maxLength.GetType(), usage.GetType(), codeTable.GetType() };
                newType         = (IType)typeRep.GetConstructor(argsType).Invoke(args);
            }
            catch (UnauthorizedAccessException uae)
            {
                throw new HL7Exception($"Impossible d'accéder à la classe '{typeRep.FullName}' ({uae.GetType().FullName}) : {uae.Message}", uae);
            }
            catch (TargetInvocationException tie)
            {
                throw new HL7Exception($"Impossible d'instancier la classe '{typeRep.FullName}' ({tie.GetType().FullName}) : {tie.Message}", tie);
            }
            catch (MethodAccessException mae)
            {
                throw new HL7Exception($"Impossible d'instancier la classe '{typeRep.FullName}' ({mae.GetType().FullName}) : {mae.Message}", mae);
            }
            catch (Exception ex)
            {
                throw new HL7Exception($"Impossible d'instancier la classe '{typeRep.FullName}' ({ex.GetType().FullName}) : {ex.Message}", ex);
            }

            return newType;
        }
    }
}