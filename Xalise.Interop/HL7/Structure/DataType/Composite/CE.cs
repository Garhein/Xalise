using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Structure.DataTable;
using Xalise.Interop.HL7.Structure.DataType.Primitive;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// CE - Coded Element.
    /// </summary>
    [Serializable]
    public class CE : AbstractTypeComposite
    {
        /// <inheritdoc/>
        public CE(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <inheritdoc/>
        public CE(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(6, description, maxLength, usage, codeTable)
        {
            this.SetComponent(1, new ST("Identifier", 20, EnumDataUsage.OPTIONAL));
            this.SetComponent(2, new ST("Text", 199, EnumDataUsage.OPTIONAL));
            this.SetComponent(3, new ID("Name Of Coding System", 20, EnumDataUsage.OPTIONAL, DataTableCodeDefinition.T0396_CODING_SYSTEM));
            this.SetComponent(4, new ST("Alternate Identifier", 20, EnumDataUsage.OPTIONAL));
            this.SetComponent(5, new ST("Alternate Text", 199, EnumDataUsage.OPTIONAL));
            this.SetComponent(6, new ID("Name Of Alternate Coding System", 20, EnumDataUsage.OPTIONAL, DataTableCodeDefinition.T0396_CODING_SYSTEM));
        }

        /// <summary>
        /// CE.1 - Identifier.
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
        /// CE.2 - Text.
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
        /// CE.3 - Name Of Coding System.
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
        /// CE.4 - Alternate Identifier.
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
        /// CE.5 - Alternate Text.
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
        /// CE.6 - Name Of Alternate Coding System.
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
    }
}