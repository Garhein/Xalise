using System;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Exceptions;
using Xalise.Interop.HL7.Structure.DataType.Primitive;
using Xalise.Interop.HL7.Structure.Table;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// CX - Extended Composite ID with Check Digit.
    /// </summary>
    [Serializable]
    public class CX : AbstractTypeComposite
    {
        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        public CX(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        /// <param name="codeTable">Code de la table de donnée associée</param>
        public CX(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(10, description, maxLength, usage, codeTable)
        {
            this[1]  = new ST("Id Number", 15, EnumDataUsage.REQUIRED);
            this[2]  = new ST("Check Digit", 1, EnumDataUsage.OPTIONAL);
            this[3]  = new ID("Check Digit Scheme", 3, EnumDataUsage.OPTIONAL, TableDefinition.T0061_CHECK_DIGIT_SCHEME);
            this[4]  = new HD("Assigning Authority", 227, EnumDataUsage.OPTIONAL, TableDefinition.T0363_ASSIGNING_AUTHORITY);
            this[5]  = new ID("Identifier Type Code", 5, EnumDataUsage.OPTIONAL, TableDefinition.T0203_IDENTIFIER_TYPE);
            this[6]  = new HD("Assigning Facility", 227, EnumDataUsage.OPTIONAL);
            this[7]  = new DT("Effective Date", 8, EnumDataUsage.OPTIONAL);
            this[8]  = new DT("Expiration Date", 8, EnumDataUsage.OPTIONAL);
            this[9]  = new CWE("Assigning Jurisdiction", 705, EnumDataUsage.OPTIONAL);
            this[10] = new CWE("Assigning Agency Or Department", 705, EnumDataUsage.OPTIONAL);
        }

        /// <summary>
        /// CX.1 - Id Number.
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
        /// CX.2 - Check Digit.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public ST CheckDigit
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this[2];
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
        /// CX.3 - Check Digit Scheme.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public ID CheckDigitScheme
        {
            get
            {
                ID ret = null;

                try
                {
                    ret = (ID)this[3];
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
        /// CX.4 - Assigning Authority.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public HD AssigningAuthority
        {
            get
            {
                HD ret = null;

                try
                {
                    ret = (HD)this[4];
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
        /// CX.5 - Identifier Type Code.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public ID IdentifierTypeCode
        {
            get
            {
                ID ret = null;

                try
                {
                    ret = (ID)this[5];
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
        /// CX.6 - Assigning Facility.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public HD AssigningFacility
        {
            get
            {
                HD ret = null;

                try
                {
                    ret = (HD)this[6];
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
        /// CX.7 - Effective Date.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public DT EffectiveDate
        {
            get
            {
                DT ret = null;

                try
                {
                    ret = (DT)this[7];
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
        /// CX.8 - Expiration Date.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public DT ExpirationDate
        {
            get
            {
                DT ret = null;

                try
                {
                    ret = (DT)this[8];
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
        /// CX.9 - Assigning Jurisdiction.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public CWE AssigningJurisdiction
        {
            get
            {
                CWE ret = null;

                try
                {
                    ret = (CWE)this[9];
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
        /// CX.10 - Assigning Agency Or Department.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public CWE AssigningAgencyOrDepartment
        {
            get
            {
                CWE ret = null;

                try
                {
                    ret = (CWE)this[10];
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
    }
}
