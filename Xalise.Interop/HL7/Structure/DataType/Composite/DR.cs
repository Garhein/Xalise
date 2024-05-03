using System;
using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// DR - Date/Time Range.
    /// </summary>
    [Serializable]
    public class DR : AbstractTypeComposite
    {
        /// <inheritdoc/>
        public DR(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <inheritdoc/>
        public DR(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(2, description, maxLength, usage, codeTable)
        {
            this.SetComponent(1, new TS("Range Start Date/Time", 26, EnumDataUsage.OPTIONAL));
            this.SetComponent(2, new TS("Range End Date/Time", 26, EnumDataUsage.OPTIONAL));
        }

        /// <summary>
        /// DR.1 - Range Start Date/Time.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public TS RangeStartDateTime
        {
            get
            {
                return this.GetComponent<TS>(1);
            }
            set
            {
                this.SetComponent<TS>(1, value);
            }
        }

        /// <summary>
        /// DR.2 - Range End Date/Time.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public TS RangeEndDateTime
        {
            get
            {
                return this.GetComponent<TS>(2);
            }
            set
            {
                this.SetComponent<TS>(2, value);
            }
        }
    }
}
