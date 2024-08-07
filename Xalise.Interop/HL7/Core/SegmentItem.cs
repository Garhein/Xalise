﻿using System;
using System.Collections.Generic;
using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Enums;

namespace Xalise.Interop.HL7.Core
{
    /// <summary>
    /// Représentation d'un champ HL7.
    /// </summary>
    [Serializable]
    public class SegmentItem
    {
        private List<IType>     _repetitions;
        private Type            _type;
        private string          _description;
        private int             _maxLength;
        private EnumDataUsage   _usage;
        private int             _maxRepetitions;
        private int             _codeTable;

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="type">Type du champ.</param>
        /// <param name="description">Description du champ.</param>
        /// <param name="maxLength">Longueur maximale de chaque répétition du champ.</param>
        /// <param name="maxRepetitions">Nombre maximum de répétitions autorisées.</param>
        /// <param name="usage">Condition d'usage du champ.</param>
        /// <exception cref="HL7Exception">Si <paramref name="type"/> n'hérite pas de <see cref="IType"/>.</exception>
        public SegmentItem(Type type, string description, int maxLength, int maxRepetitions, EnumDataUsage usage) : this(type, description, maxLength, maxRepetitions, usage, 0) { }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="type">Type du champ.</param>
        /// <param name="description">Description du champ.</param>
        /// <param name="maxLength">Longueur maximale de chaque répétition du champ.</param>
        /// <param name="maxRepetitions">Nombre maximum de répétitions autorisées.</param>
        /// <param name="usage">Condition d'usage du champ.</param>
        /// <param name="codeTable">Code de la table de données associée.</param>
        /// <exception cref="HL7Exception">Si <paramref name="type"/> n'hérite pas de <see cref="IType"/>.</exception>
        public SegmentItem(Type type, string description, int maxLength, int maxRepetitions, EnumDataUsage usage, int codeTable)
        {
            if (!typeof(IType).IsAssignableFrom(type))
            {
                throw new HL7Exception($"Le type de données '{type.FullName}' n'hérite pas de '{typeof(IType).FullName}'.");
            }

            this._repetitions       = new List<IType>();
            this._type              = type;
            this._description       = description;
            this._maxLength         = maxLength;
            this._usage             = usage;
            this._maxRepetitions    = maxRepetitions;
            this._codeTable         = codeTable;
        }

        /// <summary>
        /// Récupère les répétitions du champ.
        /// </summary>
        public List<IType> Repetitions
        {
            get
            {
                return this._repetitions;
            }
        }

        /// <summary>
        /// Récupère le type du champ.
        /// </summary>
        public Type Type
        {
            get
            {
                return this._type;
            }
        }

        /// <summary>
        /// Récupère la description du champ.
        /// </summary>
        public string Description
        {
            get
            {
                return this._description;
            }
        }

        /// <summary>
        /// Récupère la longueur maximale de chaque répétition du champ.
        /// </summary>
        public int MaxLength
        {
            get
            {
                return this._maxLength > 0 ? this._maxLength : int.MaxValue;
            }
        }

        /// <summary>
        /// Récupère la condition d'usage du champ.
        /// </summary>
        public EnumDataUsage Usage
        {
            get
            {
                return this._usage;
            }
        }

        /// <summary>
        /// Récupère le nombre maximum de répétitions autorisées.
        /// </summary>
        public int MaxRepetitions
        {
            get
            {
                return this._maxRepetitions > 0 ? this._maxRepetitions : int.MaxValue;
            }
        }

        /// <summary>
        /// Récupère le code de la table de données associée.
        /// </summary>
        public int CodeTable
        {
            get
            {
                return this._codeTable;
            }
        }

        /// <summary>
        /// Récupère une répétition du champ.
        /// </summary>
        /// <remarks>
        /// Une base 1 est utilisée pour accèder aux répétitions.
        /// </remarks>
        /// <param name="index">Index de la répétition à récupérer.</param>
        /// <returns>Répétition de type <see cref="IType"/>.</returns>
        /// <exception cref="HL7Exception">Si <paramref name="index"/> est inférieur ou égal à 0 où que la répétition n'existe pas pour l'index spécifié.</exception>
        public IType this[int index]
        {
            get
            {
                try
                {
                    if (index < 1)
                    {
                        throw new HL7Exception($"L'accès à une répétition d'un champ doit être réalisé à partir de l'index 1 (index utilisé : {index}).");
                    }
                    else
                    {
                        return this._repetitions[index - 1];
                    }
                }
                catch (ArgumentOutOfRangeException ex)
                {
                    throw new HL7Exception($"La répétition à la position {index} n'existe pas.", ex);
                }
            }
        }

        /// <summary>
        /// Convertit la liste des répétitions en un tableau de <see cref="IType"/>.
        /// </summary>
        /// <returns>Tableau des répétitions du champ.</returns>
        public FieldType[] ConvertRepetitionsToITypeArray<FieldType>()
        {
            FieldType[] ret = new FieldType[this._repetitions.Count];

            for (int i = 0; i < this._repetitions.Count; i++)
            {
                ret[i] = (FieldType)this._repetitions[i];
            }

            return ret;
        }
    }
}
