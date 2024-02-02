using System;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Exceptions;
using Xalise.Interop.HL7.Structure.DataType.Primitive;
using Xalise.Interop.HL7.Structure.Table;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// XCN - Extended Composite ID Number and Name for Persons.
    /// </summary>
    [Serializable]
    public class XCN : AbstractTypeComposite
    {
        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        public XCN(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        /// <param name="codeTable">Code de la table de donnée associée</param>
        public XCN(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(23, description, maxLength, usage, codeTable)
        {
            this[1]   = new ST("Id Number", 15, EnumDataUsage.OPTIONAL);
            this[2]   = new FN("Family Name", 194, EnumDataUsage.OPTIONAL);
            this[3]   = new ST("Given Name", 30, EnumDataUsage.OPTIONAL);
            this[4]   = new ST("Second And Further Given Names Or Initials Thereof", 30, EnumDataUsage.OPTIONAL);
            this[5]   = new ST("Suffix", 20, EnumDataUsage.OPTIONAL);
            this[6]   = new ST("Prefix", 20, EnumDataUsage.OPTIONAL);
            this[7]   = new IS("Degree", 5, EnumDataUsage.BACKWARD_COMPATIBILITY, TableDefinition.T0360_DEGREE_LICENSE_CERTIFICATE);
            this[8]   = new IS("Source Table", 4, EnumDataUsage.CONDITIONAL, TableDefinition.T0297_CN_ID_SOURCE);
            this[9]   = new HD("Assigning Authority", 227, EnumDataUsage.OPTIONAL, TableDefinition.T0363_ASSIGNING_AUTHORITY);
            this[10]  = new ID("Name Type Code", 1, EnumDataUsage.OPTIONAL, TableDefinition.T0200_NAME_TYPE);
            this[11]  = new ST("Identifier Check Digit", 1, EnumDataUsage.OPTIONAL);
            this[12]  = new ID("Check Digit Scheme", 3, EnumDataUsage.CONDITIONAL, TableDefinition.T0061_CHECK_DIGIT_SCHEME);
            this[13]  = new ID("Identifier Type Code", 5, EnumDataUsage.OPTIONAL, TableDefinition.T0203_IDENTIFIER_TYPE);
            this[14]  = new HD("Assigning Facility", 227, EnumDataUsage.OPTIONAL);
            this[15]  = new ID("Name Representation Code", 1, EnumDataUsage.OPTIONAL, TableDefinition.T0465_NAME_ADDRESS_REPRESENTATION);
            this[16]  = new CE("Name Context", 483, EnumDataUsage.OPTIONAL, TableDefinition.T0448_NAME_CONTEXT);
            this[17]  = new DR("Name Validity Range", 53, EnumDataUsage.BACKWARD_COMPATIBILITY);
            this[18]  = new ID("Name Assembly Order", 1, EnumDataUsage.OPTIONAL, TableDefinition.T0444_NAME_ASSEMBLY_ORDER);
            this[19]  = new TS("Effective Date", 26, EnumDataUsage.OPTIONAL);
            this[20]  = new TS("Expiration Date", 26, EnumDataUsage.OPTIONAL);
            this[21]  = new ST("Professional Suffix", 199, EnumDataUsage.OPTIONAL);
            this[22]  = new CWE("Assigning Jurisdiction", 705, EnumDataUsage.OPTIONAL);
            this[23]  = new CWE("Assigning Agency Or Department", 705, EnumDataUsage.OPTIONAL);
        }

        /// <summary>
        /// XCN.1 - Id Number.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public ST IdNumber
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this[1];
                }
                catch (InteropHL7Exception)
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
                catch (InteropHL7Exception)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XCN.2 - Family Name.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public FN FamilyName
        {
            get
            {
                FN ret = null;

                try
                {
                    ret = (FN)this[2];
                }
                catch (InteropHL7Exception)
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
                catch (InteropHL7Exception)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XCN.3 - Given Name.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public ST GivenName
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this[3];
                }
                catch (InteropHL7Exception)
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
                catch (InteropHL7Exception)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XCN.4 - Second And Further Given Names Or Initials Thereof.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public ST SecondAndFurtherGivennamesOrInitialsThereof
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this[4];
                }
                catch (InteropHL7Exception)
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
                catch (InteropHL7Exception)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XCN.5 - Suffix.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public ST Suffix
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this[5];
                }
                catch (InteropHL7Exception)
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
                catch (InteropHL7Exception)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XCN.6 - Prefix.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public ST Prefix
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this[6];
                }
                catch (InteropHL7Exception)
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
                catch (InteropHL7Exception)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XCN.7 - Degree.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public IS Degree
        {
            get
            {
                IS ret = null;

                try
                {
                    ret = (IS)this[7];
                }
                catch (InteropHL7Exception)
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
                catch (InteropHL7Exception)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XCN.8 - Source Table.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public IS SourceTable
        {
            get
            {
                IS ret = null;

                try
                {
                    ret = (IS)this[8];
                }
                catch (InteropHL7Exception)
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
                catch (InteropHL7Exception)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XCN.9 - Assigning Authority.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public HD AssigningAuthority
        {
            get
            {
                HD ret = null;

                try
                {
                    ret = (HD)this[9];
                }
                catch (InteropHL7Exception)
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
                catch (InteropHL7Exception)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XCN.10 - Name Type Code.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public ID NameTypeCode
        {
            get
            {
                ID ret = null;

                try
                {
                    ret = (ID)this[10];
                }
                catch (InteropHL7Exception)
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
                catch (InteropHL7Exception)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XCN.11 - Identifier Check Digit.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public ST IdentifierCheckDigit
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this[11];
                }
                catch (InteropHL7Exception)
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
                catch (InteropHL7Exception)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XCN.12 - Check Digit Scheme.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public ID CheckDigitScheme
        {
            get
            {
                ID ret = null;

                try
                {
                    ret = (ID)this[12];
                }
                catch (InteropHL7Exception)
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
                catch (InteropHL7Exception)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XCN.13 - Identifier Type Code.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public ID IdentifierTypeCode
        {
            get
            {
                ID ret = null;

                try
                {
                    ret = (ID)this[13];
                }
                catch (InteropHL7Exception)
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
                catch (InteropHL7Exception)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XCN.14 - Assigning Facility.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public HD AssigningFacility
        {
            get
            {
                HD ret = null;

                try
                {
                    ret = (HD)this[14];
                }
                catch (InteropHL7Exception)
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
                catch (InteropHL7Exception)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XCN.15 - Name Representation Code.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public ID NameRepresentationCode
        {
            get
            {
                ID ret = null;

                try
                {
                    ret = (ID)this[15];
                }
                catch (InteropHL7Exception)
                {
                    throw;
                }

                return ret;
            }
            set
            {
                try
                {
                    this[15] = value;
                }
                catch (InteropHL7Exception)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XCN.16 - Name Context.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public CE NameContext
        {
            get
            {
                CE ret = null;

                try
                {
                    ret = (CE)this[16];
                }
                catch (InteropHL7Exception)
                {
                    throw;
                }

                return ret;
            }
            set
            {
                try
                {
                    this[16] = value;
                }
                catch (InteropHL7Exception)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XCN.17 - Name Validity Range.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public DR NameValidityRange
        {
            get
            {
                DR ret = null;

                try
                {
                    ret = (DR)this[17];
                }
                catch (InteropHL7Exception)
                {
                    throw;
                }

                return ret;
            }
            set
            {
                try
                {
                    this[17] = value;
                }
                catch (InteropHL7Exception)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XCN.18 - Name Assembly Order.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public ID NameAssemblyOrder
        {
            get
            {
                ID ret = null;

                try
                {
                    ret = (ID)this[18];
                }
                catch (InteropHL7Exception)
                {
                    throw;
                }

                return ret;
            }
            set
            {
                try
                {
                    this[18] = value;
                }
                catch (InteropHL7Exception)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XCN.19 - Effective Date.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public TS EffectiveDate
        {
            get
            {
                TS ret = null;

                try
                {
                    ret = (TS)this[19];
                }
                catch (InteropHL7Exception)
                {
                    throw;
                }

                return ret;
            }
            set
            {
                try
                {
                    this[19] = value;
                }
                catch (InteropHL7Exception)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XCN.20 - Expiration Date.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public TS ExpirationDate
        {
            get
            {
                TS ret = null;

                try
                {
                    ret = (TS)this[20];
                }
                catch (InteropHL7Exception)
                {
                    throw;
                }

                return ret;
            }
            set
            {
                try
                {
                    this[20] = value;
                }
                catch (InteropHL7Exception)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XCN.21 - Professional Suffix.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public ST ProfessionalSuffix
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this[21];
                }
                catch (InteropHL7Exception)
                {
                    throw;
                }

                return ret;
            }
            set
            {
                try
                {
                    this[21] = value;
                }
                catch (InteropHL7Exception)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XCN.22 - Assigning Jurisdiction.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public CWE AssigningJurisdiction
        {
            get
            {
                CWE ret = null;

                try
                {
                    ret = (CWE)this[22];
                }
                catch (InteropHL7Exception)
                {
                    throw;
                }

                return ret;
            }
            set
            {
                try
                {
                    this[22] = value;
                }
                catch (InteropHL7Exception)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// XCN.23 - Assigning Agency Or Department.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public CWE AssigningAgencyOrDepartment
        {
            get
            {
                CWE ret = null;

                try
                {
                    ret = (CWE)this[23];
                }
                catch (InteropHL7Exception)
                {
                    throw;
                }

                return ret;
            }
            set
            {
                try
                {
                    this[23] = value;
                }
                catch (InteropHL7Exception)
                {
                    throw;
                }
            }
        }
    }
}
