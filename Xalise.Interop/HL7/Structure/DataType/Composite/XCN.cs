using System;
using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Structure.DataType.Primitive;
using Xalise.Interop.HL7.Structure.Table;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// XCN - Extended Composite ID Number and Name for Persons.
    /// </summary>
    [Serializable]
    public class XCN : AbstractTypeComposite
    {
        /// <inheritdoc/>
        public XCN(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <inheritdoc/>
        public XCN(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(23, description, maxLength, usage, codeTable)
        {
            this.SetComponent(1, new ST("Id Number", 15, EnumDataUsage.REQUIRED_OR_EMPTY));
            this.SetComponent(2, new FN("Family Name", 194, EnumDataUsage.REQUIRED_OR_EMPTY));
            this.SetComponent(3, new ST("Given Name", 30, EnumDataUsage.REQUIRED_OR_EMPTY));
            this.SetComponent(4, new ST("Second And Further Given Names Or Initials Thereof", 30, EnumDataUsage.OPTIONAL));
            this.SetComponent(5, new ST("Suffix", 20, EnumDataUsage.FORBIDDEN));
            this.SetComponent(6, new ST("Prefix", 20, EnumDataUsage.OPTIONAL));
            this.SetComponent(7, new IS("Degree", 5, EnumDataUsage.FORBIDDEN, TableCodeDefinition.T0360_DEGREE_LICENSE_CERTIFICATE));
            this.SetComponent(8, new IS("Source Table", 4, EnumDataUsage.FORBIDDEN, TableCodeDefinition.T0297_CN_ID_SOURCE));
            this.SetComponent(9, new HD("Assigning Authority", 227, EnumDataUsage.FORBIDDEN, TableCodeDefinition.T0363_ASSIGNING_AUTHORITY));
            this.SetComponent(10, new ID("Name Type Code", 1, EnumDataUsage.CONDITIONAL, TableCodeDefinition.T0200_NAME_TYPE));
            this.SetComponent(11, new ST("Identifier Check Digit", 1, EnumDataUsage.FORBIDDEN));
            this.SetComponent(12, new ID("Check Digit Scheme", 3, EnumDataUsage.FORBIDDEN, TableCodeDefinition.T0061_CHECK_DIGIT_SCHEME));
            this.SetComponent(13, new ID("Identifier Type Code", 5, EnumDataUsage.CONDITIONAL, TableCodeDefinition.T0203_IDENTIFIER_TYPE));
            this.SetComponent(14, new HD("Assigning Facility", 227, EnumDataUsage.OPTIONAL));
            this.SetComponent(15, new ID("Name Representation Code", 1, EnumDataUsage.FORBIDDEN, TableCodeDefinition.T0465_NAME_ADDRESS_REPRESENTATION));
            this.SetComponent(16, new CE("Name Context", 483, EnumDataUsage.FORBIDDEN, TableCodeDefinition.T0448_NAME_CONTEXT));
            this.SetComponent(17, new DR("Name Validity Range", 53, EnumDataUsage.FORBIDDEN));
            this.SetComponent(18, new ID("Name Assembly Order", 1, EnumDataUsage.FORBIDDEN, TableCodeDefinition.T0444_NAME_ASSEMBLY_ORDER));
            this.SetComponent(19, new TS("Effective Date", 26, EnumDataUsage.FORBIDDEN));
            this.SetComponent(20, new TS("Expiration Date", 26, EnumDataUsage.FORBIDDEN));
            this.SetComponent(21, new ST("Professional Suffix", 199, EnumDataUsage.FORBIDDEN));
            this.SetComponent(22, new CWE("Assigning Jurisdiction", 705, EnumDataUsage.FORBIDDEN));
            this.SetComponent(23, new CWE("Assigning Agency Or Department", 705, EnumDataUsage.FORBIDDEN));
        }

        /// <summary>
        /// XCN.1 - Id Number.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST IdNumber
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
        /// XCN.2 - Family Name.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public FN FamilyName
        {
            get
            {
                return this.GetComponent<FN>(2);
            }
            set
            {
                this.SetComponent<FN>(2, value);
            }
        }

        /// <summary>
        /// XCN.3 - Given Name.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST GivenName
        {
            get
            {
                return this.GetComponent<ST>(3);
            }
            set
            {
                this.SetComponent<ST>(3, value);
            }
        }

        /// <summary>
        /// XCN.4 - Second And Further Given Names Or Initials Thereof.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST SecondAndFurtherGivennamesOrInitialsThereof
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
        /// XCN.5 - Suffix.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST Suffix
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
        /// XCN.6 - Prefix.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST Prefix
        {
            get
            {
                return this.GetComponent<ST>(6);
            }
            set
            {
                this.SetComponent<ST>(6, value);
            }
        }

        /// <summary>
        /// XCN.7 - Degree.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public IS Degree
        {
            get
            {
                return this.GetComponent<IS>(7);
            }
            set
            {
                this.SetComponent<IS>(7, value);
            }
        }

        /// <summary>
        /// XCN.8 - Source Table.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public IS SourceTable
        {
            get
            {
                return this.GetComponent<IS>(8);
            }
            set
            {
                this.SetComponent<IS>(8, value);
            }
        }

        /// <summary>
        /// XCN.9 - Assigning Authority.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public HD AssigningAuthority
        {
            get
            {
                return this.GetComponent<HD>(9);
            }
            set
            {
                this.SetComponent<HD>(9, value);
            }
        }

        /// <summary>
        /// XCN.10 - Name Type Code.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ID NameTypeCode
        {
            get
            {
                return this.GetComponent<ID>(10);
            }
            set
            {
                this.SetComponent<ID>(10, value);
            }
        }

        /// <summary>
        /// XCN.11 - Identifier Check Digit.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST IdentifierCheckDigit
        {
            get
            {
                return this.GetComponent<ST>(11);
            }
            set
            {
                this.SetComponent<ST>(11, value);
            }
        }

        /// <summary>
        /// XCN.12 - Check Digit Scheme.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ID CheckDigitScheme
        {
            get
            {
                return this.GetComponent<ID>(12);
            }
            set
            {
                this.SetComponent<ID>(12, value);
            }
        }

        /// <summary>
        /// XCN.13 - Identifier Type Code.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ID IdentifierTypeCode
        {
            get
            {
                return this.GetComponent<ID>(13);
            }
            set
            {
                this.SetComponent<ID>(13, value);
            }
        }

        /// <summary>
        /// XCN.14 - Assigning Facility.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public HD AssigningFacility
        {
            get
            {
                return this.GetComponent<HD>(14);
            }
            set
            {
                this.SetComponent<HD>(14, value);
            }
        }

        /// <summary>
        /// XCN.15 - Name Representation Code.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ID NameRepresentationCode
        {
            get
            {
                return this.GetComponent<ID>(15);
            }
            set
            {
                this.SetComponent<ID>(15, value);
            }
        }

        /// <summary>
        /// XCN.16 - Name Context.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public CE NameContext
        {
            get
            {
                return this.GetComponent<CE>(16);
            }
            set
            {
                this.SetComponent<CE>(16, value);
            }
        }

        /// <summary>
        /// XCN.17 - Name Validity Range.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public DR NameValidityRange
        {
            get
            {
                return this.GetComponent<DR>(17);
            }
            set
            {
                this.SetComponent<DR>(17, value);
            }
        }

        /// <summary>
        /// XCN.18 - Name Assembly Order.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ID NameAssemblyOrder
        {
            get
            {
                return this.GetComponent<ID>(18);
            }
            set
            {
                this.SetComponent<ID>(18, value);
            }
        }

        /// <summary>
        /// XCN.19 - Effective Date.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public TS EffectiveDate
        {
            get
            {
                return this.GetComponent<TS>(19);
            }
            set
            {
                this.SetComponent<TS>(19, value);
            }
        }

        /// <summary>
        /// XCN.20 - Expiration Date.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public TS ExpirationDate
        {
            get
            {
                return this.GetComponent<TS>(20);
            }
            set
            {
                this.SetComponent<TS>(20, value);
            }
        }

        /// <summary>
        /// XCN.21 - Professional Suffix.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST ProfessionalSuffix
        {
            get
            {
                return this.GetComponent<ST>(21);
            }
            set
            {
                this.SetComponent<ST>(21, value);
            }
        }

        /// <summary>
        /// XCN.22 - Assigning Jurisdiction.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public CWE AssigningJurisdiction
        {
            get
            {
                return this.GetComponent<CWE>(22);
            }
            set
            {
                this.SetComponent<CWE>(22, value);
            }
        }

        /// <summary>
        /// XCN.23 - Assigning Agency Or Department.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public CWE AssigningAgencyOrDepartment
        {
            get
            {
                return this.GetComponent<CWE>(23);
            }
            set
            {
                this.SetComponent<CWE>(23, value);
            }
        }
    }
}
