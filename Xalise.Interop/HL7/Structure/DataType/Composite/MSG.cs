using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Structure.DataTable;
using Xalise.Interop.HL7.Structure.DataType.Primitive;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// MSG - Message Type.
    /// </summary>
    /// <author>Xavier VILLEMIN - xavier.villemin@gmail.com</author>
    [Serializable]
    public class MSG : AbstractTypeComposite
    {
        /// <inheritdoc/>
        public MSG(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <inheritdoc/>
        public MSG(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(3, description, maxLength, usage, codeTable)
        {
            this.SetComponent(1, new ID("Message Code", 3, EnumDataUsage.REQUIRED, DataTableCodeDefinition.T0076_MESSAGE_TYPE));
            this.SetComponent(2, new ID("Trigger Event", 3, EnumDataUsage.REQUIRED, DataTableCodeDefinition.T0003_EVENT_TYPE));
            this.SetComponent(3, new ID("Message Structure", 7, EnumDataUsage.REQUIRED, DataTableCodeDefinition.T0354_MESSAGE_STRUCTURE));
        }

        /// <summary>
        /// MSG.1 - Message Code.
        /// </summary>
        public ID MessageCode
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
        /// MSG.2 - Trigger Event.
        /// </summary>
        public ID TriggerEvent
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
        /// MSG.3 - Message Structure.
        /// </summary>
        public ID MessageStructure
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
    }
}
