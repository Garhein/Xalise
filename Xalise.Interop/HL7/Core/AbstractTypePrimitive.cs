using System;
using Xalise.Interop.HL7.Enums;

namespace Xalise.Interop.HL7.Core
{
    /// <summary>
    /// Représentation d'un type de donnée primitif.
    /// </summary>
    [Serializable]
    public abstract class AbstractTypePrimitive : AbstractType, ITypePrimitive
    {
        private string _value;

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        public AbstractTypePrimitive(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        /// <param name="codeTable">Code de la table de donnée associée</param>
        public AbstractTypePrimitive(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(description, maxLength, usage, codeTable) 
        {
            this._value = string.Empty;
        }

        /// <summary>
        /// Affecte et récupère la valeur du type de donnée.
        /// </summary>
        public string Value
        {
            get
            {
                return this._value;
            }
            set
            {
                this._value = value;
            }
        }
    }
}
