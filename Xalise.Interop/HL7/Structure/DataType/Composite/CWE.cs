using System;
using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
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
        /// <inheritdoc/>
        public CWE(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <inheritdoc/>
        public CWE(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(9, description, maxLength, usage, codeTable)
        {
            this.SetComponent<ST>(1, new ST("Identifier", 20, EnumDataUsage.OPTIONAL));
            this.SetComponent<ST>(2, new ST("Text", 199, EnumDataUsage.OPTIONAL));
            this.SetComponent<ID>(3, new ID("Name Of Coding System", 20, EnumDataUsage.OPTIONAL, TableCodeDefinition.T0396_CODING_SYSTEM));
            this.SetComponent<ST>(4, new ST("Alternate Identifier", 20, EnumDataUsage.OPTIONAL));
            this.SetComponent<ST>(5, new ST("Alternate Text", 199, EnumDataUsage.OPTIONAL));
            this.SetComponent<ID>(6, new ID("Name Of Alternate Coding System", 20, EnumDataUsage.OPTIONAL, TableCodeDefinition.T0396_CODING_SYSTEM));
            this.SetComponent<ST>(7, new ST("Coding System Version Id", 10, EnumDataUsage.CONDITIONAL));
            this.SetComponent<ST>(8, new ST("Alternate Coding System Version Id", 10, EnumDataUsage.OPTIONAL));
            this.SetComponent<ST>(9, new ST("Original Text", 199, EnumDataUsage.OPTIONAL));
        }

        /// <summary>
        /// CWE.1 - Identifier.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST Identifier
        {
            get
            {
                return this.GetComponent<ST>(1);
            }
            set
            {
                this.SetComponent<ST>(1, value);
            }
        }

        /// <summary>
        /// CWE.2 - Text.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST Text
        {
            get
            {
                return this.GetComponent<ST>(2);
            }
            set
            {
                this.SetComponent<ST>(2, value);
            }
        }

        /// <summary>
        /// CWE.3 - Name Of Coding System.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ID NameOfCodingSystem
        {
            get
            {
                return this.GetComponent<ID>(3);
            }
            set
            {
                this.SetComponent<ID>(3, value);
            }
        }

        /// <summary>
        /// CWE.4 - Alternate Identifier.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST AlternateIdentifier
        {
            get
            {
                return this.GetComponent<ST>(4);
            }
            set
            {
                this.SetComponent<ST>(4, value);
            }
        }

        /// <summary>
        /// CWE.5 - Alternate Text.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST AlternateText
        {
            get
            {
                return this.GetComponent<ST>(5);
            }
            set
            {
                this.SetComponent<ST>(5, value);
            }
        }

        /// <summary>
        /// CWE.6 - Name Of Alternate Coding System.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ID NameOfAlternateCodingSystem
        {
            get
            {
                return this.GetComponent<ID>(6);
            }
            set
            {
                this.SetComponent<ID>(6, value);
            }
        }

        /// <summary>
        /// CWE.7 - Coding System Version Id.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST CodingSystemVersionId
        {
            get
            {
                return this.GetComponent<ST>(7);
            }
            set
            {
                this.SetComponent<ST>(7, value);
            }
        }

        /// <summary>
        /// CWE.8 - Alternate Coding System Version Id.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST AlternateCodingSystemVersionId
        {
            get
            {
                return this.GetComponent<ST>(8);
            }
            set
            {
                this.SetComponent<ST>(8, value);
            }
        }

        /// <summary>
        /// CWE.9 - Original Text.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST OriginalText
        {
            get
            {
                return this.GetComponent<ST>(9);
            }
            set
            {
                this.SetComponent<ST>(9, value);
            }
        }
    }
}
