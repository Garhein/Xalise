using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Structure.DataTable;
using Xalise.Interop.HL7.Structure.DataType.Primitive;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// VID - Entity Identifier.
    /// </summary>
    /// <author>Xavier VILLEMIN - xavier.villemin@gmail.com</author>
    [Serializable]
    public class VID : AbstractTypeComposite
    {
        /// <inheritdoc/>
        public VID(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <inheritdoc/>
        public VID(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(3, description, maxLength, usage, codeTable)
        {
            this.SetComponent(1, new ID("Version Id", 5, EnumDataUsage.OPTIONAL, DataTableCodeDefinition.T0104_VERSION_ID));
            this.SetComponent(2, new CE("Internationalization Code", 483, EnumDataUsage.OPTIONAL, DataTableCodeDefinition.T0399_COUNTRY_CODE));
            this.SetComponent(3, new CE("International Version Id", 483, EnumDataUsage.OPTIONAL));
        }

        /// <summary>
        /// VID.1 - Version Id.
        /// </summary>
        public ID VersionId
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
        /// VID.2 - Internationalization Code.
        /// </summary>
        public CE InternationalizationCode
        {
            get
            {
                return this.GetComponent<CE>(2);
            }
            set
            {
                this.SetComponent<CE>(2, value);
            }
        }

        /// <summary>
        /// VID.3 - International Version Id.
        /// </summary>
        public CE InternationalVersionId
        {
            get
            {
                return this.GetComponent<CE>(3);
            }
            set
            {
                this.SetComponent<CE>(3, value);
            }
        }
    }
}