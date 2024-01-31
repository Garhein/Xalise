using System;
using System.Reflection;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Exceptions;
using Xalise.Interop.HL7.Structure.DataType.Primitive;
using Xalise.Interop.HL7.Structure.Table;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// XPN - Extended Person Name.
    /// </summary>
    [Serializable]
    public class XPN : AbstractTypeComposite
    {
        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        public XPN(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        /// <param name="codeTable">Code de la table de donnée associée</param>
        public XPN(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(14, description, maxLength, usage, codeTable)
        {
            this[1]  = new FN("Family Name", 194, EnumDataUsage.OPTIONAL);
            this[2]  = new ST("Given Name", 30, EnumDataUsage.OPTIONAL);
            this[3]  = new ST("Second And Further Given Names Or Initials Thereof", 30, EnumDataUsage.OPTIONAL);
            this[4]  = new ST("Suffix", 20, EnumDataUsage.OPTIONAL);
            this[5]  = new ST("Prefix", 20, EnumDataUsage.OPTIONAL);
            this[6]  = new IS("Degree", 6, EnumDataUsage.BACKWARD_COMPATIBILITY, TableDefinition.T0360_DEGREE_LICENSE_CERTIFICATE);
            this[7]  = new ID("Name Type Code", 1, EnumDataUsage.OPTIONAL, TableDefinition.T0200_NAME_TYPE);
            this[8]  = new ID("Name Representation Code", 1, EnumDataUsage.OPTIONAL, TableDefinition.T0465_NAME_ADDRESS_REPRESENTATION);
            this[9]  = new CE("Name Context", 483, EnumDataUsage.OPTIONAL, TableDefinition.T0448_NAME_CONTEXT);
            this[10] = new DR("Name Validity Range", 53, EnumDataUsage.BACKWARD_COMPATIBILITY);
            this[11] = new ID("Name Assembly Order", 1, EnumDataUsage.OPTIONAL, TableDefinition.T0444_NAME_ASSEMBLY_ORDER);
            this[12] = new TS("Effective Date", 26, EnumDataUsage.OPTIONAL);
            this[13] = new TS("Expiration Date", 26, EnumDataUsage.OPTIONAL);
            this[14] = new ST("Professional Suffix", 199, EnumDataUsage.OPTIONAL);
        }

        /// <summary>
        /// XPN.1 - Family Name.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public FN FamilyName
        {
            get
            {
                FN ret = null;

                try
                {
                    ret = (FN)this[1];
                }
                catch (DataTypeException)
                {
                    throw;
                }

                return ret;
            }
            set
            {
                try
                {
                    this[1] = value;
                }
                catch (DataTypeException)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XPN.2 - Given Name.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ST GivenName
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this[2];
                }
                catch (DataTypeException)
                {
                    throw;
                }

                return ret;
            }
            set
            {
                try
                {
                    this[2] = value;
                }
                catch (DataTypeException)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XPN.3 - Second And Further Given Names Or Initials Thereof.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ST SecondAndFurtherGivenNamesOrInitialsThereof
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this[3];
                }
                catch (DataTypeException)
                {
                    throw;
                }

                return ret;
            }
            set
            {
                try
                {
                    this[3] = value;
                }
                catch (DataTypeException)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XPN.4 - Suffix.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ST Suffix
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this[4];
                }
                catch (DataTypeException)
                {
                    throw;
                }

                return ret;
            }
            set
            {
                try
                {
                    this[4] = value;
                }
                catch (DataTypeException)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XPN.5 - Prefix.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ST Prefix
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this[5];
                }
                catch (DataTypeException)
                {
                    throw;
                }

                return ret;
            }
            set
            {
                try
                {
                    this[5] = value;
                }
                catch (DataTypeException)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XPN.6 - Degree.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public IS Degree
        {
            get
            {
                IS ret = null;

                try
                {
                    ret = (IS)this[6];
                }
                catch (DataTypeException)
                {
                    throw;
                }

                return ret;
            }
            set
            {
                try
                {
                    this[6] = value;
                }
                catch (DataTypeException)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XPN.7 - Name Type Code.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ID NameTypeCode
        {
            get
            {
                ID ret = null;

                try
                {
                    ret = (ID)this[7];
                }
                catch (DataTypeException)
                {
                    throw;
                }

                return ret;
            }
            set
            {
                try
                {
                    this[7] = value;
                }
                catch (DataTypeException)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XPN.8 - Name Representation Code.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ID NameRepresentationCode
        {
            get
            {
                ID ret = null;

                try
                {
                    ret = (ID)this[8];
                }
                catch (DataTypeException)
                {
                    throw;
                }

                return ret;
            }
            set
            {
                try
                {
                    this[8] = value;
                }
                catch (DataTypeException)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XPN.9 - Name Context.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public CE NameContext
        {
            get
            {
                CE ret = null;

                try
                {
                    ret = (CE)this[9];
                }
                catch (DataTypeException)
                {
                    throw;
                }

                return ret;
            }
            set
            {
                try
                {
                    this[9] = value;
                }
                catch (DataTypeException)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XPN.10 - Name Validity Range.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public DR NameValidityRange
        {
            get
            {
                DR ret = null;

                try
                {
                    ret = (DR)this[10];
                }
                catch (DataTypeException)
                {
                    throw;
                }

                return ret;
            }
            set
            {
                try
                {
                    this[10] = value;
                }
                catch (DataTypeException)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XPN.11 - Name Assembly Order.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ID NameAssemblyOrder
        {
            get
            {
                ID ret = null;

                try
                {
                    ret = (ID)this[11];
                }
                catch (DataTypeException)
                {
                    throw;
                }

                return ret;
            }
            set
            {
                try
                {
                    this[11] = value;
                }
                catch (DataTypeException)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XPN.12 - Effective Date.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public TS EffectiveDate
        {
            get
            {
                TS ret = null;

                try
                {
                    ret = (TS)this[12];
                }
                catch (DataTypeException)
                {
                    throw;
                }

                return ret;
            }
            set
            {
                try
                {
                    this[12] = value;
                }
                catch (DataTypeException)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XPN.13 - Expiration Date.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public TS ExpirationDate
        {
            get
            {
                TS ret = null;

                try
                {
                    ret = (TS)this[13];
                }
                catch (DataTypeException)
                {
                    throw;
                }

                return ret;
            }
            set
            {
                try
                {
                    this[13] = value;
                }
                catch (DataTypeException)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XPN.14 - Professional Suffix.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ST ProfessionalSuffix
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this[14];
                }
                catch (DataTypeException)
                {
                    throw;
                }

                return ret;
            }
            set
            {
                try
                {
                    this[14] = value;
                }
                catch (DataTypeException)
                {
                    throw;
                }
            }
        }
    }
}
