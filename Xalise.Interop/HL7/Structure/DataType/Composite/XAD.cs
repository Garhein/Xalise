using System;
using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Structure.DataType.Primitive;
using Xalise.Interop.HL7.Structure.Table;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// XAD - Extended Address.
    /// </summary>
    [Serializable]
    public class XAD : AbstractTypeComposite
    {
        /// <inheritdoc/>
        public XAD(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <inheritdoc/>
        public XAD(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(14, description, maxLength, usage, codeTable)
        {
            this.SetComponent(1, new SAD("Street Address", 184, EnumDataUsage.OPTIONAL));
            this.SetComponent(2, new ST("Other Designation", 120, EnumDataUsage.OPTIONAL));
            this.SetComponent(3, new ST("City", 50, EnumDataUsage.OPTIONAL));
            this.SetComponent(4, new ST("State Or Province", 50, EnumDataUsage.OPTIONAL));
            this.SetComponent(5, new ST("Zip Or Postal Code", 12, EnumDataUsage.OPTIONAL));
            this.SetComponent(6, new ID("Country", 3, EnumDataUsage.OPTIONAL, TableCodeDefinition.T0399_COUNTRY_CODE));
            this.SetComponent(7, new ID("Address Type", 3, EnumDataUsage.OPTIONAL, TableCodeDefinition.T0190_ADDRESS_TYPE));
            this.SetComponent(8, new ST("Other Geographic Designation", 50, EnumDataUsage.OPTIONAL));
            this.SetComponent(9, new IS("County/Parish Code", 20, EnumDataUsage.OPTIONAL, TableCodeDefinition.T0289_COUNTY_PARISH));
            this.SetComponent(10, new IS("Census Tract", 20, EnumDataUsage.OPTIONAL, TableCodeDefinition.T0288_CENSUS_TRACT));
            this.SetComponent(11, new ID("Address Representation Code", 1, EnumDataUsage.OPTIONAL, TableCodeDefinition.T0465_NAME_ADDRESS_REPRESENTATION));
            this.SetComponent(12, new DR("Address Validity Range", 53, EnumDataUsage.FORBIDDEN));
            this.SetComponent(13, new TS("Effective Date", 26, EnumDataUsage.OPTIONAL));
            this.SetComponent(14, new TS("Expiration Date", 26, EnumDataUsage.OPTIONAL));
        }

        /// <summary>
        /// XAD.1 - Street Address.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public SAD StreetAddress
        {
            get
            {
                return this.GetComponent<SAD>(1);
            }
            set
            {
                this.SetComponent<SAD>(1, value);
            }
        }

        /// <summary>
        /// XAD.2 - Other Designation.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST OtherDesignation
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
        /// XAD.3 - City.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST City
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
        /// XAD.4 - State Or Province.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST StateOrProvince
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
        /// XAD.5 - Zip Or Postal Code.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST ZipOrPostalCode
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
        /// XAD.6 - Country.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ID Country
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
        /// XAD.7 - Address Type.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ID AddressType
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
        /// XAD.8 - Other Geographic Designation.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST OtherGeographicDesignation
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
        /// XAD.9 - County/Parish Code.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public IS CountyParishCode
        {
            get
            {
                return this.GetComponent<IS>(9);
            }
            set
            {
                this.SetComponent<IS>(9, value);
            }
        }

        /// <summary>
        /// XAD.10 - Census Tract.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public IS CensusTract
        {
            get
            {
                return this.GetComponent<IS>(10);
            }
            set
            {
                this.SetComponent<IS>(10, value);
            }
        }

        /// <summary>
        /// XAD.11 - Address Representation Code.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ID AddressRepresentationCode
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
        /// XAD.12 - Address Validity Range.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public DR AddressValidityRange
        {
            get
            {
                return this.GetComponent<DR>(12);
            }
            set
            {
                this.SetComponent<DR>(12, value);
            }
        }

        /// <summary>
        /// XAD.13 - Effective Date.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public TS EffectiveDate
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
        /// XAD.14 - Expiration Date.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public TS ExpirationDate
        {
            get
            {
                return this.GetComponent<TS>(14);
            }
            set
            {
                this.SetComponent<TS>(14, value);
            }
        }
    }
}
