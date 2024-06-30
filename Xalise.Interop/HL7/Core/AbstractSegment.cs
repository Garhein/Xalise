using System;
using System.Collections.Generic;
using System.Reflection;
using Xalise.Core.Helpers;
using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Helpers;

namespace Xalise.Interop.HL7.Core
{
    public abstract class AbstractSegment : ISegment
    {
        private List<SegmentItem> _items;

        public AbstractSegment(IGroup parentStructure)
        {
            this.ParentStructure = parentStructure;
            this._items = new List<SegmentItem>();
        }

        /// <inheritdoc/>
        public IMessage Message
        {
            get
            {
                IStructure structure = this;

                while (!typeof(IMessage).IsAssignableFrom(structure.GetType()))
                {
                    structure = structure.ParentStructure;
                }

                return (IMessage)structure;
            }
        }

        /// <inheritdoc/>
        public IGroup ParentStructure { get; }

        /// <inheritdoc/>
        public string StructureName
        {
            get 
            {
                return TypeHelper.GetTypeName(this);
            }
        }

        /// <inheritdoc/>
        public FieldType[] GetField<FieldType>(int fieldNumber)
        {
            this.CheckFieldNumber(fieldNumber);

            return this._items[fieldNumber - 1].ConvertRepetitionsToITypeArray<FieldType>();
        }

        /// <inheritdoc/>
        public FieldType GetField<FieldType>(int fieldNumber, int repNumber)
        {
            this.CheckFieldNumber(fieldNumber, repNumber);

            int currentRep = this._items[fieldNumber - 1].Repetitions.Count;

            // Création d'une répétition si nécessaire et si la limite maximale n'est pas atteinte
            if (repNumber > currentRep)
            {
                if (repNumber > this._items[fieldNumber - 1].MaxRepetitions)
                {
                    throw new HL7Exception($"Impossible d'ajouter la répétition {FieldHelper.ConstructFieldNumber(this.StructureName, fieldNumber, repNumber)} : le nombre maximal autorisé de répétition est de {this._items[fieldNumber - 1].MaxRepetitions}.");
                }
                else
                {
                    this._items[fieldNumber - 1].Repetitions.Add(this.CreateNewField(fieldNumber));
                }
            }

            return (FieldType)this._items[fieldNumber - 1].Repetitions[repNumber - 1];
        }

        /// <inheritdoc/>
        public string GetFieldDescription(int fieldNumber)
        {
            this.CheckFieldNumber(fieldNumber);

            return this._items[fieldNumber - 1].Description;
        }

        /// <inheritdoc/>
        public int GetFieldMaxLength(int fieldNumber)
        {
            this.CheckFieldNumber(fieldNumber);

            return this._items[fieldNumber - 1].MaxLength;
        }

        /// <inheritdoc/>
        public EnumDataUsage GetFieldUsage(int fieldNumber)
        {
            this.CheckFieldNumber(fieldNumber);

            return this._items[fieldNumber - 1].Usage;
        }

        /// <inheritdoc/>
        public int GetFieldMaxRepetitions(int fieldNumber)
        {
            this.CheckFieldNumber(fieldNumber);

            return this._items[fieldNumber - 1].MaxRepetitions;
        }

        /// <inheritdoc/>
        public int GetFieldCodeTable(int fieldNumber)
        {
            this.CheckFieldNumber(fieldNumber);

            return this._items[fieldNumber - 1].CodeTable;
        }

        /// <inheritdoc/>
        public int GetTotalFieldRepetitions(int fieldNumber)
        {
            this.CheckFieldNumber(fieldNumber);

            return this._items[fieldNumber - 1].Repetitions.Count;
        }

        /// <inheritdoc/>
        public void RemoveRepetition(int fieldNumber, int repNumber)
        {
            this.CheckFieldNumber(fieldNumber, repNumber);

            if (this._items[fieldNumber - 1].Repetitions.Count == 0)
            {
                
                throw new HL7Exception($"Impossible de retirer la répétition {FieldHelper.ConstructFieldNumber(this.StructureName, fieldNumber, repNumber)} : la structure ne contient aucune répétition.");
            }

            if (this._items[fieldNumber - 1].Repetitions.Count < repNumber)
            {
                throw new HL7Exception($"Impossible de retirer la répétition {FieldHelper.ConstructFieldNumber(this.StructureName, fieldNumber, repNumber)} : la répétition {repNumber} n'existe pas.");
            }

            this._items[fieldNumber - 1].Repetitions.RemoveAt(repNumber - 1);
        }

        /// <inheritdoc/>
        public void RemoveRepetition(int fieldNumber, IType repToRemove)
        {
            this.CheckFieldNumber(fieldNumber);

            if (this._items[fieldNumber - 1].Repetitions.Count == 0)
            {
                throw new HL7Exception($"Impossible de retirer la répétition du champ {FieldHelper.ConstructFieldNumber(this.StructureName, fieldNumber)} : la structure ne contient aucune répétition.");
            }

            if (!this._items[fieldNumber - 1].Repetitions.Contains(repToRemove))
            {
                throw new HL7Exception($"Impossible de retirer la répétition du champ {FieldHelper.ConstructFieldNumber(this.StructureName, fieldNumber)} : la structure ne contient pas la répétition à retirer.");
            }

            this._items[fieldNumber - 1].Repetitions.Remove(repToRemove);
        }

        /// <inheritdoc/>
        public int NumFields
        {
            get
            {
                return this._items.Count;
            }
        }

        private void CheckFieldNumber(int fieldNumber, int? repNumber = null)
        {
            if (fieldNumber <= 0)
            {
                throw new HL7Exception($"L'accès à un champ doit être réalisé à partir de l'index 1 (index utilisé : {fieldNumber}.");
            }

            if (fieldNumber > this.NumFields)
            {
                throw new HL7Exception($"Impossible d'accéder au champ {FieldHelper.ConstructFieldNumber(this.StructureName, fieldNumber)} : il n'y a que {this.NumFields} champs dans le segment.");
            }

            if (repNumber.HasValue)
            {
                if (repNumber.Value <= 0)
                {
                    throw new HL7Exception($"L'accès à une répétition d'un champ doit être réalisé à partir de l'index 1 (index utilisé : {repNumber}).");
                }
            }
        }

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
                Object[] args   = new Object[4] { descr, maxLength, usage, codeTable };
                Type[] argsType = new Type[4] { descr.GetType(), maxLength.GetType(), usage.GetType(), codeTable.GetType() };
                newType         = (IType)typeRep.GetConstructor(argsType).Invoke(args);
            }
            catch (UnauthorizedAccessException authAccessEx)
            {
                throw new HL7Exception($"Impossible d'accéder à la classe '{typeRep.FullName}' ({authAccessEx.GetType().FullName}) : {authAccessEx.Message}", authAccessEx);
            }
            catch (TargetInvocationException targetIncovationEx)
            {
                throw new HL7Exception($"Impossible d'instancier la classe '{typeRep.FullName}' ({targetIncovationEx.GetType().FullName}) : {targetIncovationEx.Message}", targetIncovationEx);
            }
            catch (MethodAccessException methodAccessEx)
            {
                throw new HL7Exception($"Impossible d'instancier la classe '{typeRep.FullName}' ({methodAccessEx.GetType().FullName}) : {methodAccessEx.Message}", methodAccessEx);
            }
            catch (Exception ex)
            {
                throw new HL7Exception($"Impossible d'instancier la classe '{typeRep.FullName}' ({ex.GetType().FullName}) : {ex.Message}", ex);
            }

            return newType;
        }

        protected void AddField(Type type, string description, int maxLength, int maxRepetitions, EnumDataUsage usage)
        {
            this.AddField(type, description, maxLength, maxRepetitions, usage, 0);
        }

        protected void AddField(Type type, string description, int maxLength, int maxRepetitions, EnumDataUsage usage, int codeTable)
        {
            if (!typeof(IType).IsAssignableFrom(type))
            {
                throw new HL7Exception($"Le type de données '{type.FullName}' n'hérite pas de '{typeof(IType).FullName}'.");
            }

            this._items.Add(new SegmentItem(type, description, maxLength, maxRepetitions, usage, codeTable));
        }
    }
}
