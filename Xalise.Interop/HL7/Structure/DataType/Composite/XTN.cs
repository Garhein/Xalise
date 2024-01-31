using System;
using System.Reflection;
using System.Runtime.Intrinsics.X86;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Exceptions;
using Xalise.Interop.HL7.Structure.DataType.Primitive;
using Xalise.Interop.HL7.Structure.Table;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// XTN - Extended Telecommunication Number.
    /// </summary>
    [Serializable]
    public class XTN : AbstractTypeComposite
    {
        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        public XTN(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        /// <param name="codeTable">Code de la table de donnée associée</param>
        public XTN(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(12, description, maxLength, usage, codeTable)
        {
            this[1]  = new ST("Telephone Number", 199, EnumDataUsage.BACKWARD_COMPATIBILITY);
            this[2]  = new ID("Telecommunication Use Code", 3, EnumDataUsage.OPTIONAL, TableDefinition.T0201_TELECOMMUNICATION_USE_CODE);
            this[3]  = new ID("Telecommunication Equipment Type", 8, EnumDataUsage.OPTIONAL, TableDefinition.T0202_TELECOMMUNICATION_EQUIPMENT_TYPE);
            this[4]  = new ST("Email Address", 199, EnumDataUsage.OPTIONAL);
            this[5]  = new NM("Country Code", 3, EnumDataUsage.OPTIONAL);
            this[6]  = new NM("Area/City Code", 5, EnumDataUsage.OPTIONAL);
            this[7]  = new NM("Local Number", 9, EnumDataUsage.OPTIONAL);
            this[8]  = new NM("Extension", 5, EnumDataUsage.OPTIONAL);
            this[9]  = new ST("Any Text", 199, EnumDataUsage.OPTIONAL);
            this[10] = new ST("Extension Prefix", 4, EnumDataUsage.OPTIONAL);
            this[11] = new ST("Speed Dial Code", 6, EnumDataUsage.OPTIONAL);
            this[12] = new ST("Unformatted Telephone Number", 199, EnumDataUsage.CONDITIONAL);
        }

        /// <summary>
        /// XTN.1 - Telephone Number.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ST TelephoneNumber
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
        /// XTN.2 - Telecommunication Use Code.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ID TelecommunicationUseCode
        {
            get
            {
                ID ret = null;

                try
                {
                    ret = (ID)this[2];
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
        /// XTN.3 - Telecommunication Equipment Type.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ID TelecommunicationEquipmentType
        {
            get
            {
                ID ret = null;

                try
                {
                    ret = (ID)this[3];
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
        /// XTN.4 - Email Address.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ST EmailAddress
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
        /// XTN.5 - Country Code.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public NM CountryCode
        {
            get
            {
                NM ret = null;

                try
                {
                    ret = (NM)this[5];
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
        /// XTN.6 - Area/City Code.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public NM AreaCityCode
        {
            get
            {
                NM ret = null;

                try
                {
                    ret = (NM)this[6];
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
        /// XTN.7 - Local Number.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public NM LocalNumber
        {
            get
            {
                NM ret = null;

                try
                {
                    ret = (NM)this[7];
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
        /// XTN.8 - Extension.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public NM Extension
        {
            get
            {
                NM ret = null;

                try
                {
                    ret = (NM)this[8];
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
        /// XTN.9 - Any Text.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ST AnyText
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this[9];
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
        /// XTN.10 - Extension Prefix.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ST ExtensionPrefix
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

        /// <summary>
        /// XTN.11 - Speed Dial Code.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ST SpeedDialCode
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this[11];
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
        /// XTN.12 - Unformatted Telephone Number.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ST UnformattedTelephoneNumber
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this[12];
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
    }
}
