using Xalise.Core.Helpers;
using Xalise.Interop.HL7.Enums;

namespace Xalise.Interop.HL7.Core
{
    /// <summary>
    /// Type de données HL7.
    /// </summary>
    /// <author>Xavier VILLEMIN - xavier.villemin@gmail.com</author>
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
        /// <param name="description">Description de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        public AbstractType(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        /// <param name="codeTable">Code de la table de données associée.</param>
        public AbstractType(string description, int maxLength, EnumDataUsage usage, int codeTable)
        {
            this._description   = description;
            this._maxLength     = maxLength;
            this._usage         = usage;
            this._codeTable     = codeTable;
        }

        /// <inheritdoc/>
        public string TypeName => TypeHelper.GetTypeName(this);

        /// <summary>
        /// Description de la donnée.
        /// </summary>
        protected string Description => this._description;

        /// <summary>
        /// Longueur maximale autorisée.
        /// </summary>
        protected int MaxLength => this._maxLength;

        /// <summary>
        /// Condition d'usage de la donnée.
        /// </summary>
        protected EnumDataUsage Usage => this._usage;

        /// <summary>
        /// Code de la table de données associée.
        /// </summary>
        protected int CodeTable => this._codeTable;
    }
}
