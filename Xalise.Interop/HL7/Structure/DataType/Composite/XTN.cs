using System;
using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Structure.DataType.Primitive;
using Xalise.Interop.HL7.Structure.Table;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// XTN - Extended Telecommunication Number.
    /// </summary>
    [Serializable]
    public class XTN : AbstractTypeComposite
    {
        /// <inheritdoc/>
        public XTN(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <inheritdoc/>
        public XTN(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(12, description, maxLength, usage, codeTable)
        {
            this.SetComponent(1, new ST("Telephone Number", 199, EnumDataUsage.FORBIDDEN));
            this.SetComponent(2, new ID("Telecommunication Use Code", 3, EnumDataUsage.OPTIONAL, TableCodeDefinition.T0201_TELECOMMUNICATION_USE_CODE));
            this.SetComponent(3, new ID("Telecommunication Equipment Type", 8, EnumDataUsage.OPTIONAL, TableCodeDefinition.T0202_TELECOMMUNICATION_EQUIPMENT_TYPE));
            this.SetComponent(4, new ST("Email Address", 199, EnumDataUsage.CONDITIONAL));
            this.SetComponent(5, new NM("Country Code", 3, EnumDataUsage.FORBIDDEN));
            this.SetComponent(6, new NM("Area/City Code", 5, EnumDataUsage.FORBIDDEN));
            this.SetComponent(7, new NM("Local Number", 9, EnumDataUsage.FORBIDDEN));
            this.SetComponent(8, new NM("Extension", 5, EnumDataUsage.FORBIDDEN));
            this.SetComponent(9, new ST("Any Text", 199, EnumDataUsage.OPTIONAL));
            this.SetComponent(10, new ST("Extension Prefix", 4, EnumDataUsage.FORBIDDEN));
            this.SetComponent(11, new ST("Speed Dial Code", 6, EnumDataUsage.FORBIDDEN));
            this.SetComponent(12, new ST("Unformatted Telephone Number", 199, EnumDataUsage.CONDITIONAL));
        }

        /// <summary>
        /// XTN.1 - Telephone Number.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST TelephoneNumber
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
        /// XTN.2 - Telecommunication Use Code.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ID TelecommunicationUseCode
        {
            get
            {
                return this.GetComponent<ID>(2);
            }
            set
            {
                this.SetComponent<ID>(2, value);
            }
        }

        /// <summary>
        /// XTN.3 - Telecommunication Equipment Type.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ID TelecommunicationEquipmentType
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
        /// XTN.4 - Email Address.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST EmailAddress
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
        /// XTN.5 - Country Code.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public NM CountryCode
        {
            get
            {
                return this.GetComponent<NM>(5);
            }
            set
            {
                this.SetComponent<NM>(5, value);
            }
        }

        /// <summary>
        /// XTN.6 - Area/City Code.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public NM AreaCityCode
        {
            get
            {
                return this.GetComponent<NM>(6);
            }
            set
            {
                this.SetComponent<NM>(6, value);
            }
        }

        /// <summary>
        /// XTN.7 - Local Number.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public NM LocalNumber
        {
            get
            {
                return this.GetComponent<NM>(7);
            }
            set
            {
                this.SetComponent<NM>(7, value);
            }
        }

        /// <summary>
        /// XTN.8 - Extension.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public NM Extension
        {
            get
            {
                return this.GetComponent<NM>(8);
            }
            set
            {
                this.SetComponent<NM>(8, value);
            }
        }

        /// <summary>
        /// XTN.9 - Any Text.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST AnyText
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

        /// <summary>
        /// XTN.10 - Extension Prefix.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST ExtensionPrefix
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

        /// <summary>
        /// XTN.11 - Speed Dial Code.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST SpeedDialCode
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
        /// XTN.12 - Unformatted Telephone Number.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST UnformattedTelephoneNumber
        {
            get
            {
                return this.GetComponent<ST>(12);
            }
            set
            {
                this.SetComponent<ST>(12, value);
            }
        }
    }
}
