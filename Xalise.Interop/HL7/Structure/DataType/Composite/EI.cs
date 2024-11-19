using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Structure.DataTable;
using Xalise.Interop.HL7.Structure.DataType.Primitive;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// EI - Entity Identifier.
    /// </summary>
    /// <author>Xavier VILLEMIN - xavier.villemin@gmail.com</author>
    [Serializable]
    public class EI : AbstractTypeComposite
    {
        /// <inheritdoc/>
        public EI(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <inheritdoc/>
        public EI(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(4, description, maxLength, usage, codeTable)
        {
            this.SetComponent(1, new ST("Entity Identifier", 199, EnumDataUsage.OPTIONAL));
            this.SetComponent(2, new IS("Namespace Id", 20, EnumDataUsage.OPTIONAL, DataTableCodeDefinition.T0363_ASSIGNING_AUTHORITY));
            this.SetComponent(3, new ST("Universal Id", 199, EnumDataUsage.CONDITIONAL));
            this.SetComponent(4, new ID("Universal Id Type", 6, EnumDataUsage.CONDITIONAL, DataTableCodeDefinition.T0301_UNIVERSAL_ID_TYPE));
        }

        /// <summary>
        /// EI.1 - Entity Identifier.
        /// </summary>
        public ST EntityIdentifier
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
        /// EI.2 - Namespace Id.
        /// </summary>
        public IS NamespaceId
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
        /// EI.3 - Universal Id.
        /// </summary>
        public ST UniversalId
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
        /// EI.4 - Universal Id Type.
        /// </summary>
        public ID UniversalIdType
        {
            get
            {
                return this.GetComponent<ID>(4);
            }
            set
            {
                this.SetComponent<ID>(4, value);
            }
        }
    }
}