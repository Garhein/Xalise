using System;
using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Structure.DataType.Primitive;
using Xalise.Interop.HL7.Structure.Table;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// TS - Time Stamp.
    /// </summary>
    [Serializable]
    public class TS : AbstractTypeComposite
    {
        /// <inheritdoc/>
        public TS(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <inheritdoc/>
        public TS(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(2, description, maxLength, usage, codeTable)
        {
            this.SetComponent<DTM>(1, new DTM("Time", 24, EnumDataUsage.REQUIRED));
            this.SetComponent<ID>(2, new ID("Degree Of Precision", 1, EnumDataUsage.BACKWARD_COMPATIBILITY, TableCodeDefinition.T0529_PRECISION));
        }

        /// <summary>
        /// TS.1 - Time.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public DTM Time
        {
            get
            {
                return this.GetComponent<DTM>(1);
            }
            set
            {
                this.SetComponent<DTM>(1, value);
            }
        }

        /// <summary>
        /// TS.2 - Degree Of Precision.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ID DegreeOfPrecision
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
    }
}
