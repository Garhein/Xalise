using System;
using System.Collections.Generic;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Exceptions;

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

        public SegmentItem(Type type, string description, int maxLength, int maxRepetitions, EnumDataUsage usage) : this(type, description, maxLength, maxRepetitions, usage, 0) { }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="type">Type du champ.</param>
        /// <param name="description">Description du champ.</param>
        /// <param name="maxLength">Longueur maximale de chaque répétition.</param>
        /// <param name="maxRepetitions">Nombre maximum de répétitions autorisées.</param>
        /// <param name="usage">Condition d'usage du champ.</param>
        /// <param name="codeTable">Code de la table de donnée associée.</param>
        public SegmentItem(Type type, string description, int maxLength, int maxRepetitions, EnumDataUsage usage, int codeTable)
        {
            if (!typeof(IType).IsAssignableFrom(type))
            {
                throw new DataTypeException($"Le type '{type.FullName}' n'hérite pas de '{typeof(IType).FullName}'.");
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
        /// Récupère la longueur maximale de chaque répétition.
        /// </summary>
        public int MaxLength
        {
            get
            {
                return this._maxLength > 0 ? this._maxLength : int.MaxValue;
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
        /// Récupère le code de la table de donnée associée.
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
        /// Les répétitions sont stockées à partir de l'indice 0 mais une base 1 est utilisée pour les accès.
        /// </remarks>
        /// <param name="index">Index de la répétition à récupérer.</param>
        /// <returns>Répétition de type <see cref="IType"/>.</returns>
        /// <exception cref="DataTypeException">Si <paramref name="index"/> est inférieur ou égal à 0 ou qu'il est hors bornes.</exception>
        public IType this[int index]
        {
            get
            {
                try
                {
                    if (index <= 0)
                    {
                        throw new DataTypeException($"L'accès à une répétition d'un champ doit être réalisé à partir de l'index 1 (index utilisé : {index}).");
                    }
                    else
                    {
                        return this._repetitions[index - 1];
                    }
                }
                catch (ArgumentOutOfRangeException)
                {
                    throw new DataTypeException($"La répétition à la position {index} n'existe pas.");
                }
            }
        }

        /// <summary>
        /// Convertit la liste des répétitions en un tableau de <see cref="IType"/>.
        /// </summary>
        /// <returns>Tableau de <seealso cref="IType"/>.</returns>
        public IType[] ConvertRepetitionsToITypeArray()
        {
            return this._repetitions.ToArray();
        }
    }
}
