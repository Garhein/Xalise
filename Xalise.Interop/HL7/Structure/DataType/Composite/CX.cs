using System;
using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Structure.DataType.Primitive;
using Xalise.Interop.HL7.Structure.Table;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// CX - Extended Composite ID with Check Digit.
    /// </summary>
    [Serializable]
    public class CX : AbstractTypeComposite
    {
        /// <inheritdoc/>
        public CX(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <inheritdoc/>
        public CX(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(10, description, maxLength, usage, codeTable)
        {
            this.SetComponent(1, new ST("Id Number", 15, EnumDataUsage.REQUIRED));
            this.SetComponent(2, new ST("Check Digit", 1, EnumDataUsage.OPTIONAL));
            this.SetComponent(3, new ID("Check Digit Scheme", 3, EnumDataUsage.OPTIONAL, TableCodeDefinition.T0061_CHECK_DIGIT_SCHEME));
            this.SetComponent(4, new HD("Assigning Authority", 227, EnumDataUsage.OPTIONAL, TableCodeDefinition.T0363_ASSIGNING_AUTHORITY));
            this.SetComponent(5, new ID("Identifier Type Code", 5, EnumDataUsage.OPTIONAL, TableCodeDefinition.T0203_IDENTIFIER_TYPE));
            this.SetComponent(6, new HD("Assigning Facility", 227, EnumDataUsage.OPTIONAL));
            this.SetComponent(7, new DT("Effective Date", 8, EnumDataUsage.OPTIONAL));
            this.SetComponent(8, new DT("Expiration Date", 8, EnumDataUsage.OPTIONAL));
            this.SetComponent(9, new CWE("Assigning Jurisdiction", 705, EnumDataUsage.OPTIONAL));
            this.SetComponent(10, new CWE("Assigning Agency Or Department", 705, EnumDataUsage.OPTIONAL));
        }

        /// <summary>
        /// CX.1 - Id Number.
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
        /// CX.2 - Check Digit.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST CheckDigit
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
        /// CX.3 - Check Digit Scheme.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ID CheckDigitScheme
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
        /// CX.4 - Assigning Authority.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public HD AssigningAuthority
        {
            get
            {
                return this.GetComponent<HD>(4);
            }
            set
            {
                this.SetComponent<HD>(4, value);
            }
        }

        /// <summary>
        /// CX.5 - Identifier Type Code.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ID IdentifierTypeCode
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
        /// CX.6 - Assigning Facility.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public HD AssigningFacility
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
        /// CX.7 - Effective Date.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public DT EffectiveDate
        {
            get
            {
                return this.GetComponent<DT>(7);
            }
            set
            {
                this.SetComponent<DT>(7, value);
            }
        }

        /// <summary>
        /// CX.8 - Expiration Date.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public DT ExpirationDate
        {
            get
            {
                return this.GetComponent<DT>(8);
            }
            set
            {
                this.SetComponent<DT>(8, value);
            }
        }

        /// <summary>
        /// CX.9 - Assigning Jurisdiction.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public CWE AssigningJurisdiction
        {
            get
            {
                return this.GetComponent<CWE>(9);
            }
            set
            {
                this.SetComponent<CWE>(9, value);
            }
        }

        /// <summary>
        /// CX.10 - Assigning Agency Or Department.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public CWE AssigningAgencyOrDepartment
        {
            get
            {
                return this.GetComponent<CWE>(10);
            }
            set
            {
                this.SetComponent<CWE>(10, value);
            }
        }
    }
}
