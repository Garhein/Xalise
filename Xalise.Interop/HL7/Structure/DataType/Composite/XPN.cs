using System;
using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Structure.DataType.Primitive;
using Xalise.Interop.HL7.Structure.Table;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// XPN - Extended Person Name.
    /// </summary>
    [Serializable]
    public class XPN : AbstractTypeComposite
    {
        /// <inheritdoc/>
        public XPN(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <inheritdoc/>
        public XPN(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(14, description, maxLength, usage, codeTable)
        {
            this.SetComponent(1, new FN("Family Name", 194, EnumDataUsage.REQUIRED_OR_EMPTY));
            this.SetComponent(2, new ST("Given Name", 30, EnumDataUsage.OPTIONAL));
            this.SetComponent(3, new ST("Second And Further Given Names Or Initials Thereof", 30, EnumDataUsage.OPTIONAL));
            this.SetComponent(4, new ST("Suffix", 20, EnumDataUsage.FORBIDDEN));
            this.SetComponent(5, new ST("Prefix", 20, EnumDataUsage.OPTIONAL));
            this.SetComponent(6, new IS("Degree", 6, EnumDataUsage.FORBIDDEN, TableCodeDefinition.T0360_DEGREE_LICENSE_CERTIFICATE));
            this.SetComponent(7, new ID("Name Type Code", 1, EnumDataUsage.REQUIRED, TableCodeDefinition.T0200_NAME_TYPE));
            this.SetComponent(8, new ID("Name Representation Code", 1, EnumDataUsage.FORBIDDEN, TableCodeDefinition.T0465_NAME_ADDRESS_REPRESENTATION));
            this.SetComponent(9, new CE("Name Context", 483, EnumDataUsage.FORBIDDEN, TableCodeDefinition.T0448_NAME_CONTEXT));
            this.SetComponent(10, new DR("Name Validity Range", 53, EnumDataUsage.FORBIDDEN));
            this.SetComponent(11, new ID("Name Assembly Order", 1, EnumDataUsage.FORBIDDEN, TableCodeDefinition.T0444_NAME_ASSEMBLY_ORDER));
            this.SetComponent(12, new TS("Effective Date", 26, EnumDataUsage.FORBIDDEN));
            this.SetComponent(13, new TS("Expiration Date", 26, EnumDataUsage.FORBIDDEN));
            this.SetComponent(14, new ST("Professional Suffix", 199, EnumDataUsage.FORBIDDEN));
        }

        /// <summary>
        /// XPN.1 - Family Name.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public FN FamilyName
        {
            get
            {
                return this.GetComponent<FN>(1);
            }
            set
            {
                this.SetComponent<FN>(1, value);
            }
        }

        /// <summary>
        /// XPN.2 - Given Name.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST GivenName
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
        /// XPN.3 - Second And Further Given Names Or Initials Thereof.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST SecondAndFurtherGivenNamesOrInitialsThereof
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
        /// XPN.4 - Suffix.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST Suffix
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
        /// XPN.5 - Prefix.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST Prefix
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
        /// XPN.6 - Degree.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public IS Degree
        {
            get
            {
                return this.GetComponent<IS>(6);
            }
            set
            {
                this.SetComponent<IS>(6, value);
            }
        }

        /// <summary>
        /// XPN.7 - Name Type Code.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ID NameTypeCode
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
        /// XPN.8 - Name Representation Code.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ID NameRepresentationCode
        {
            get
            {
                return this.GetComponent<ID>(8);
            }
            set
            {
                this.SetComponent<ID>(8, value);
            }
        }

        /// <summary>
        /// XPN.9 - Name Context.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public CE NameContext
        {
            get
            {
                return this.GetComponent<CE>(9);
            }
            set
            {
                this.SetComponent<CE>(9, value);
            }
        }

        /// <summary>
        /// XPN.10 - Name Validity Range.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public DR NameValidityRange
        {
            get
            {
                return this.GetComponent<DR>(10);
            }
            set
            {
                this.SetComponent<DR>(10, value);
            }
        }

        /// <summary>
        /// XPN.11 - Name Assembly Order.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ID NameAssemblyOrder
        {
            get
            {
                return this.GetComponent<ID>(11);
            }
            set
            {
                this.SetComponent<ID>(11, value);
            }
        }

        /// <summary>
        /// XPN.12 - Effective Date.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public TS EffectiveDate
        {
            get
            {
                return this.GetComponent<TS>(12);
            }
            set
            {
                this.SetComponent<TS>(12, value);
            }
        }

        /// <summary>
        /// XPN.13 - Expiration Date.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public TS ExpirationDate
        {
            get
            {
                return this.GetComponent<TS>(13);
            }
            set
            {
                this.SetComponent<TS>(13, value);
            }
        }

        /// <summary>
        /// XPN.14 - Professional Suffix.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST ProfessionalSuffix
        {
            get
            {
                return this.GetComponent<ST>(14);
            }
            set
            {
                this.SetComponent<ST>(14, value);
            }
        }
    }
}
