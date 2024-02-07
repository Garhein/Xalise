using System;
using Xalise.Core.Helpers;
using Xalise.Interop.HL7.Enums;

namespace Xalise.Interop.HL7.Core
{
    /// <summary>
    /// Représentation d'un type de donnée HL7.
    /// </summary>
    [Serializable]
    public abstract class AbstractType : IType
    {
        private string          _description;
        private int             _maxLength;
        private EnumDataUsage   _usage;
        private int             _codeTable;

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        public AbstractType(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        /// <param name="codeTable">Code de la table de donnée associée.</param>
        public AbstractType(string description, int maxLength, EnumDataUsage usage, int codeTable)
        {
            this._description   = description;
            this._maxLength     = maxLength;
            this._usage         = usage;
            this._codeTable     = codeTable;
        }

        /// <inheritdoc/>
        public string TypeName
        {
            get
            {
                return TypeHelper.GetTypeName(this);
            }
        }

        /// <summary>
        /// Récupère la description du type de la donnée.
        /// </summary>
        protected string Description
        {
            get
            {
                return this._description;
            }
        }
    
        /// <summary>
        /// Récupère la longueur maximale autorisée.
        /// </summary>
        protected int MaxLength
        {
            get
            {
                return this._maxLength > 0 ? this._maxLength : int.MaxValue;
            }
        }

        /// <summary>
        /// Récupère la condition d'usage de la donnée.
        /// </summary>
        protected EnumDataUsage Usage
        {
            get
            {
                return this._usage;
            }
        }
    
        /// <summary>
        /// Récupère le code de la table de donnée associée.
        /// </summary>
        protected int CodeTable
        {
            get
            {
                return this._codeTable;
            }
        }
    }
}
