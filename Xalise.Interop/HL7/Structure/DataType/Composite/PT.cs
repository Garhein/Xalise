using System;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Exceptions;
using Xalise.Interop.HL7.Structure.DataType.Primitive;
using Xalise.Interop.HL7.Structure.Table;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// PT - Processing Type.
    /// </summary>
    [Serializable]
    public class PT : AbstractTypeComposite
    {
        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        public PT(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        /// <param name="codeTable">Code de la table de donnée associée</param>
        public PT(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(2, description, maxLength, usage, codeTable)
        {
            this[1] = new ID("Processing Id", 1, EnumDataUsage.OPTIONAL, TableDefinition.T0103_PROCESSING_ID);
            this[2] = new ID("Processing Mode", 1, EnumDataUsage.OPTIONAL, TableDefinition.T0207_PROCESSING_MODE);
        }

        /// <summary>
        /// PT.1 - Processing Id.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ID ProcessingId
        {
            get
            {
                ID ret = null;

                try
                {
                    ret = (ID)this[1];
                }
                catch (DataTypeException)
                {
                    throw;
                }

                return ret;
            }
            set
            {
                try
                {
                    this[1] = value;
                }
                catch (DataTypeException)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// PT.2 - Processing Mode.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ID ProcessingMode
        {
            get
            {
                ID ret = null;

                try
                {
                    ret = (ID)this[2];
                }
                catch (DataTypeException)
                {
                    throw;
                }

                return ret;
            }
            set
            {
                try
                {
                    this[2] = value;
                }
                catch (DataTypeException)
                {
                    throw;
                }
            }
        }
    }
}
