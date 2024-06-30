using System;
using System.Collections.Generic;
using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Enums;

namespace Xalise.Interop.HL7.Core
{
    public class MessageItem
    {
        private List<IStructure>    _structures;
        private Type                _type;
        private string              _name;
        EnumDataUsage               _usage;
        private int                 _maxRepetitions;
        private bool                _choiceElement;

        public MessageItem(Type type, string name, EnumDataUsage usage, int maxRepetitions, bool choiceElement)
        {
            if (!typeof(IStructure).IsAssignableFrom(type))
            {
                throw new HL7Exception($"Le type '{type.FullName}' n'hérite pas de '{typeof(IStructure).FullName}'.");
            }

            this._structures        = new List<IStructure>();
            this._type              = type;
            this._name              = name;
            this._usage             = usage;
            this._maxRepetitions    = maxRepetitions;
            this._choiceElement     = choiceElement;
        }

        public List<IStructure> Structures => this._structures;

        public Type Type => this._type;

        public String Name => this._name;

        public EnumDataUsage Usage => this._usage;

        public int MaxRepetitions
        {
            get
            {
                return this._maxRepetitions > 0 ? this._maxRepetitions : int.MaxValue;
            }
        }

        public bool IsChoiceElement => this._choiceElement;

        public IStructure this[int index]
        {
            get
            {
                try
                {
                    if (index < 1)
                    {
                        throw new HL7Exception($"L'accès à une répétition d'une structure doit être réalisé à partir de l'index 1 (index utilisé : {index}).");
                    }
                    else
                    {
                        return this._structures[index - 1];
                    }
                }
                catch (ArgumentOutOfRangeException ex)
                {
                    throw new HL7Exception($"La répétition de structure à la position {index} n'existe pas.", ex);
                }
            }
            set
            {
                if (index < 1)
                {
                    throw new HL7Exception($"L'accès à une répétition d'une structure doit être réalisé à partir de l'index 1 (index utilisé : {index}).");
                }

                if (index > this.MaxRepetitions)
                {
                    throw new HL7Exception($"Impossible d'ajouter une répétition de la structure {this.Name} : le nombre maximal autorisé de répétition est de {this.MaxRepetitions}.");
                }

                this._structures[index - 1] = value;
            }
        }
    }
}
