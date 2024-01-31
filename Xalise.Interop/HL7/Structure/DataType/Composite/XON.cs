using System;
using System.Xml.Linq;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Exceptions;
using Xalise.Interop.HL7.Structure.DataType.Primitive;
using Xalise.Interop.HL7.Structure.Table;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// XON - Extended Composite Name and Identification Number for Organizations.
    /// </summary>
    [Serializable]
    public class XON : AbstractTypeComposite
    {
        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        public XON(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        /// <param name="codeTable">Code de la table de donnée associée</param>
        public XON(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(10, description, maxLength, usage, codeTable)
        {
            this[1]  = new ST("Organization Name", 50, EnumDataUsage.BACKWARD_COMPATIBILITY);
            this[2]  = new IS("Organization Name Type Code", 20, EnumDataUsage.BACKWARD_COMPATIBILITY, TableDefinition.T0204_ORGANIZATIONAL_NAME_TYPE);
            this[3]  = new NM("Id Number", 4, EnumDataUsage.BACKWARD_COMPATIBILITY);
            this[4]  = new NM("Check Digit", 1, EnumDataUsage.OPTIONAL);
            this[5]  = new ID("Check Digit Scheme", 3, EnumDataUsage.OPTIONAL, TableDefinition.T0061_CHECK_DIGIT_SCHEME);
            this[6]  = new HD("Assigning Authority", 227, EnumDataUsage.OPTIONAL, TableDefinition.T0363_ASSIGNING_AUTHORITY);
            this[7]  = new ID("Identifier Type Code", 5, EnumDataUsage.OPTIONAL, TableDefinition.T0203_IDENTIFIER_TYPE);
            this[8]  = new HD("Assigning Facility", 227, EnumDataUsage.OPTIONAL);
            this[9]  = new ID("Name Representation Code", 1, EnumDataUsage.OPTIONAL, TableDefinition.T0465_NAME_ADDRESS_REPRESENTATION);
            this[10] = new ST("Organization Identifier", 20, EnumDataUsage.OPTIONAL);
        }

        /// <summary>
        /// XON.1 - Organization Name.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ST OrganizationName
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this[1];
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
        /// XON.2 - Organization Name Type Code.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public IS OrganizationNameTypeCode
        {
            get
            {
                IS ret = null;

                try
                {
                    ret = (IS)this[2];
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
        /// XON.3 - Id Number.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public NM IdNumber
        {
            get
            {
                NM ret = null;

                try
                {
                    ret = (NM)this[3];
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
        /// XON.4 - Check Digit.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public NM CheckDigit
        {
            get
            {
                NM ret = null;

                try
                {
                    ret = (NM)this[4];
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
        /// XON.5 - Check Digit Scheme.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ID CheckDigitScheme
        {
            get
            {
                ID ret = null;

                try
                {
                    ret = (ID)this[5];
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
        /// XON.6 - Assigning Authority.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public HD AssigningAuthority
        {
            get
            {
                HD ret = null;

                try
                {
                    ret = (HD)this[6];
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
        /// XON.7 - Identifier Type Code.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ID IdentifierTypeCode
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
        /// XON.8 - Assigning Facility.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public HD AssigningFacility
        {
            get
            {
                HD ret = null;

                try
                {
                    ret = (HD)this[8];
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
        /// XON.9 - Name Representation Code.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ID NameRepresentationCode
        {
            get
            {
                ID ret = null;

                try
                {
                    ret = (ID)this[9];
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
        /// XON.10 - Organization Identifier.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ST OrganizationIdentifier
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this[10];
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
    }
}
