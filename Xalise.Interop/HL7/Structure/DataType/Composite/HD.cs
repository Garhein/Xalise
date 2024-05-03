using System;
using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Structure.DataType.Primitive;
using Xalise.Interop.HL7.Structure.Table;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// HD - Hierarchic Designator.
    /// </summary>
    [Serializable]
    public class HD : AbstractTypeComposite
    {
        /// <inheritdoc/>
        public HD(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <inheritdoc/>
        public HD(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(3, description, maxLength, usage, codeTable)
        {
            this.SetComponent(1, new IS("Namespace Id", 20, EnumDataUsage.OPTIONAL, TableCodeDefinition.T0300_NAMESPACE_ID));
            this.SetComponent(2, new ST("Universal Id", 199, EnumDataUsage.CONDITIONAL));
            this.SetComponent(3, new ID("Universal Id Type", 6, EnumDataUsage.CONDITIONAL, TableCodeDefinition.T0301_UNIVERSAL_ID_TYPE));
        }

        /// <summary>
        /// HD.1 - Namespace Id.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public IS NamespaceId
        {
            get
            {
                return this.GetComponent<IS>(1);
            }
            set
            {
                this.SetComponent<IS>(1, value);
            }
        }

        /// <summary>
        /// HD.2 - Universal Id.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST UniversalId
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
        /// HD.3 - Universal Id Type.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ID UniversalIdType
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
