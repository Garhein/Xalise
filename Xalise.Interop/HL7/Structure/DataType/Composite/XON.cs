using System;
using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Structure.DataType.Primitive;
using Xalise.Interop.HL7.Structure.Table;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// XON - Extended Composite Name and Identification Number for Organizations.
    /// </summary>
    [Serializable]
    public class XON : AbstractTypeComposite
    {
        /// <inheritdoc/>
        public XON(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <inheritdoc/>
        public XON(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(10, description, maxLength, usage, codeTable)
        {
            this.SetComponent(1, new ST("Organization Name", 50, EnumDataUsage.REQUIRED_OR_EMPTY));
            this.SetComponent(2, new IS("Organization Name Type Code", 20, EnumDataUsage.FORBIDDEN, TableCodeDefinition.T0204_ORGANIZATIONAL_NAME_TYPE));
            this.SetComponent(3, new NM("Id Number", 4, EnumDataUsage.FORBIDDEN));
            this.SetComponent(4, new NM("Check Digit", 1, EnumDataUsage.FORBIDDEN));
            this.SetComponent(5, new ID("Check Digit Scheme", 3, EnumDataUsage.FORBIDDEN, TableCodeDefinition.T0061_CHECK_DIGIT_SCHEME));
            this.SetComponent(6, new HD("Assigning Authority", 227, EnumDataUsage.REQUIRED_OR_EMPTY, TableCodeDefinition.T0363_ASSIGNING_AUTHORITY));
            this.SetComponent(7, new ID("Identifier Type Code", 5, EnumDataUsage.REQUIRED_OR_EMPTY, TableCodeDefinition.T0203_IDENTIFIER_TYPE));
            this.SetComponent(8, new HD("Assigning Facility", 227, EnumDataUsage.FORBIDDEN));
            this.SetComponent(9, new ID("Name Representation Code", 1, EnumDataUsage.FORBIDDEN, TableCodeDefinition.T0465_NAME_ADDRESS_REPRESENTATION));
            this.SetComponent(10, new ST("Organization Identifier", 64, EnumDataUsage.REQUIRED_OR_EMPTY));
        }

        /// <summary>
        /// XON.1 - Organization Name.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST OrganizationName
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
        /// XON.2 - Organization Name Type Code.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public IS OrganizationNameTypeCode
        {
            get
            {
                return this.GetComponent<IS>(2);
            }
            set
            {
                this.SetComponent<IS>(2, value);
            }
        }

        /// <summary>
        /// XON.3 - Id Number.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public NM IdNumber
        {
            get
            {
                return this.GetComponent<NM>(3);
            }
            set
            {
                this.SetComponent<NM>(3, value);
            }
        }

        /// <summary>
        /// XON.4 - Check Digit.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public NM CheckDigit
        {
            get
            {
                return this.GetComponent<NM>(4);
            }
            set
            {
                this.SetComponent<NM>(4, value);
            }
        }

        /// <summary>
        /// XON.5 - Check Digit Scheme.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ID CheckDigitScheme
        {
            get
            {
                return this.GetComponent<ID>(5);
            }
            set
            {
                this.SetComponent<ID>(5, value);
            }
        }

        /// <summary>
        /// XON.6 - Assigning Authority.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public HD AssigningAuthority
        {
            get
            {
                return this.GetComponent<HD>(6);
            }
            set
            {
                this.SetComponent<HD>(6, value);
            }
        }

        /// <summary>
        /// XON.7 - Identifier Type Code.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ID IdentifierTypeCode
        {
            get
            {
                return this.GetComponent<ID>(7);
            }
            set
            {
                this.SetComponent<ID>(7, value);
            }
        }

        /// <summary>
        /// XON.8 - Assigning Facility.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public HD AssigningFacility
        {
            get
            {
                return this.GetComponent<HD>(8);
            }
            set
            {
                this.SetComponent<HD>(8, value);
            }
        }

        /// <summary>
        /// XON.9 - Name Representation Code.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ID NameRepresentationCode
        {
            get
            {
                return this.GetComponent<ID>(9);
            }
            set
            {
                this.SetComponent<ID>(9, value);
            }
        }

        /// <summary>
        /// XON.10 - Organization Identifier.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST OrganizationIdentifier
        {
            get
            {
                return this.GetComponent<ST>(10);
            }
            set
            {
                this.SetComponent<ST>(10, value);
            }
        }
    }
}
