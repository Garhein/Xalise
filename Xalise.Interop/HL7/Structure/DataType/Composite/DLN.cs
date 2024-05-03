using System;
using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Structure.DataType.Primitive;
using Xalise.Interop.HL7.Structure.Table;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// DLN - Driver License Number.
    /// </summary>
    [Serializable]
    public class DLN : AbstractTypeComposite
    {
        /// <inheritdoc/>
        public DLN(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <inheritdoc/>
        public DLN(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(3, description, maxLength, usage, codeTable)
        {
            this.SetComponent(1, new ST("License Number", 20, EnumDataUsage.REQUIRED));
            this.SetComponent(2, new IS("Issuing State, Province, Country", 20, EnumDataUsage.OPTIONAL, TableCodeDefinition.T0333_DRIVER_LICENSE_ISSUING));
            this.SetComponent(3, new DT("Expiration Date", 24, EnumDataUsage.OPTIONAL));
        }

        /// <summary>
        /// DLN.1 - License Number.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST LicenseNumber
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
        /// DLN.2 - Issuing State, Province, Country.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public IS IssuingStateProvinceCountry
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
        /// DLN.3 - Expiration Date.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public DT ExpirationDate
        {
            get
            {
                return this.GetComponent<DT>(3);
            }
            set
            {
                this.SetComponent<DT>(3, value);
            }
        }
    }
}
