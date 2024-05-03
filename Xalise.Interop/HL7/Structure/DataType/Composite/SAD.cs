using System;
using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Structure.DataType.Primitive;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// SAD - Street Address.
    /// </summary>
    [Serializable]
    public class SAD : AbstractTypeComposite
    {
        /// <inheritdoc/>
        public SAD(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <inheritdoc/>
        public SAD(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(3, description, maxLength, usage, codeTable)
        {
            this.SetComponent(1, new ST("Street Or Mailing Address", 120, EnumDataUsage.OPTIONAL));
            this.SetComponent(2, new ST("Street Name", 50, EnumDataUsage.FORBIDDEN));
            this.SetComponent(3, new ST("Dwelling Number", 12, EnumDataUsage.FORBIDDEN));
        }

        /// <summary>
        /// SAD.1 - Street Or Mailing Address.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST StreetOrMailingAddress
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
        /// SAD.2 - Street Name.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST StreetName
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
        /// SAD.3 - Dwelling Number.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST DwellingNumber
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
    }
}
