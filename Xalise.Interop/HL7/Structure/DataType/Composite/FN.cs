using System;
using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Structure.DataType.Primitive;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// FN - Family Name.
    /// </summary>
    [Serializable]
    public class FN : AbstractTypeComposite
    {
        /// <inheritdoc/>
        public FN(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <inheritdoc/>
        public FN(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(5, description, maxLength, usage, codeTable)
        {
            this.SetComponent(1, new ST("Surname", 50, EnumDataUsage.REQUIRED));
            this.SetComponent(2, new ST("Own Surname Prefix", 20, EnumDataUsage.OPTIONAL));
            this.SetComponent(3, new ST("Own Surname", 50, EnumDataUsage.OPTIONAL));
            this.SetComponent(4, new ST("Surname Prefix From Partner/Spouse", 20, EnumDataUsage.OPTIONAL));
            this.SetComponent(5, new ST("Surname From Partner/Spouse", 50, EnumDataUsage.OPTIONAL));
        }

        /// <summary>
        /// FN.1 - Surname.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST Surname
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
        /// FN.2 - Own Surname Prefix.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST OwnSurnamePrefix
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
        /// FN.3 - Own Surname.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST OwnSurname
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
        /// FN.4 - Surname Prefix From Partner/Spouse.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST SurnamePrefixFromPartnerSpouse
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
        /// FN.5 - Surname From Partner/Spouse.
        /// </summary>
        /// <exception cref="HL7Exception">Si erreur à l'accès au composant.</exception>
        public ST SurnameFromPartnerSpouse
        {
            get
            {
                return this.GetComponent<ST>(5);
            }
            set
            {
                this.SetComponent<ST>(5, value);
            }
        }
    }
}
