using System;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Exceptions;
using Xalise.Interop.HL7.Structure.DataType.Primitive;
using Xalise.Interop.HL7.Structure.Table;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// CWE - Coded with Exceptions.
    /// </summary>
    [Serializable]
    public class CWE : AbstractTypeComposite
    {
        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        public CWE(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        /// <param name="codeTable">Code de la table de donnée associée</param>
        public CWE(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(9, description, maxLength, usage, codeTable)
        {
            this[1] = new ST("Identifier", 20, EnumDataUsage.OPTIONAL);
            this[2] = new ST("Text", 199, EnumDataUsage.OPTIONAL);
            this[3] = new ID("Name Of Coding System", 20, EnumDataUsage.OPTIONAL, TableDefinition.T0396_CODING_SYSTEM);
            this[4] = new ST("Alternate Identifier", 20, EnumDataUsage.OPTIONAL);
            this[5] = new ST("Alternate Text", 199, EnumDataUsage.OPTIONAL);
            this[6] = new ID("Name Of Alternate Coding System", 20, EnumDataUsage.OPTIONAL, TableDefinition.T0396_CODING_SYSTEM);
            this[7] = new ST("Coding System Version Id", 10, EnumDataUsage.CONDITIONAL);
            this[8] = new ST("Alternate Coding System Version Id", 10, EnumDataUsage.OPTIONAL);
            this[9] = new ST("Original Text", 199, EnumDataUsage.OPTIONAL);
        }

        /// <summary>
        /// CWE.1 - Identifier.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ST Identifier
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this[1];
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
        /// CWE.2 - Text.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ST Text
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this[2];
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

        /// <summary>
        /// CWE.3 - Name Of Coding System.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ID NameOfCodingSystem
        {
            get
            {
                ID ret = null;

                try
                {
                    ret = (ID)this[3];
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
                    this[3] = value;
                }
                catch (DataTypeException)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// CWE.4 - Alternate Identifier.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ST AlternateIdentifier
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this[4];
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
                    this[4] = value;
                }
                catch (DataTypeException)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// CWE.5 - Alternate Text.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ST AlternateText
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this[5];
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
                    this[5] = value;
                }
                catch (DataTypeException)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// CWE.6 - Name Of Alternate Coding System.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ID NameOfAlternateCodingSystem
        {
            get
            {
                ID ret = null;

                try
                {
                    ret = (ID)this[6];
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
                    this[6] = value;
                }
                catch (DataTypeException)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// CWE.7 - Coding System Version Id.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ST CodingSystemVersionId
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this[7];
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
                    this[7] = value;
                }
                catch (DataTypeException)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// CWE.8 - Alternate Coding System Version Id.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ST AlternateCodingSystemVersionId
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this[8];
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
                    this[8] = value;
                }
                catch (DataTypeException)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// CWE.9 - Original Text.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ST OriginalText
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this[9];
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
                    this[9] = value;
                }
                catch (DataTypeException)
                {
                    throw;
                }
            }
        }
    }
}
