using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Structure.DataTable;
using Xalise.Interop.HL7.Structure.DataType.Primitive;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// PT - Processing Type.
    /// </summary>
    /// <author>Xavier VILLEMIN - xavier.villemin@gmail.com</author>
    [Serializable]
    public class PT : AbstractTypeComposite
    {
        /// <inheritdoc/>
        public PT(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <inheritdoc/>
        public PT(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(2, description, maxLength, usage, codeTable)
        {
            this.SetComponent(1, new ID("Processing Id", 1, EnumDataUsage.OPTIONAL, DataTableCodeDefinition.T0103_PROCESSING_ID));
            this.SetComponent(2, new ID("Processing Mode", 1, EnumDataUsage.OPTIONAL, DataTableCodeDefinition.T0207_PROCESSING_MODE));
        }

        /// <summary>
        /// PT.1 - Processing Id.
        /// </summary>
        public ID ProcessingId
        {
            get
            {
                return this.GetComponent<ID>(1);
            }
            set
            {
                this.SetComponent<ID>(1, value);
            }
        }

        /// <summary>
        /// PT.2 - Processing Mode.
        /// </summary>
        public ID ProcessingMode
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
