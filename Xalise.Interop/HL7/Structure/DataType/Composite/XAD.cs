using System;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Exceptions;
using Xalise.Interop.HL7.Structure.DataType.Primitive;
using Xalise.Interop.HL7.Structure.Table;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// XAD - Extended Address.
    /// </summary>
    [Serializable]
    public class XAD : AbstractTypeComposite
    {
        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        public XAD(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        /// <param name="codeTable">Code de la table de donnée associée</param>
        public XAD(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(14, description, maxLength, usage, codeTable)
        {
            this[1]  = new SAD("Street Address", 184, EnumDataUsage.OPTIONAL);
            this[2]  = new ST("Other Designation", 120, EnumDataUsage.OPTIONAL);
            this[3]  = new ST("City", 50, EnumDataUsage.OPTIONAL);
            this[4]  = new ST("State Or Province", 50, EnumDataUsage.OPTIONAL);
            this[5]  = new ST("Zip Or Postal Code", 12, EnumDataUsage.OPTIONAL);
            this[6]  = new ID("Country", 3, EnumDataUsage.OPTIONAL, TableDefinition.T0399_COUNTRY_CODE);
            this[7]  = new ID("Address Type", 3, EnumDataUsage.OPTIONAL, TableDefinition.T0190_ADDRESS_TYPE);
            this[8]  = new ST("Other Geographic Designation", 50, EnumDataUsage.OPTIONAL);
            this[9]  = new IS("County/Parish Code", 20, EnumDataUsage.OPTIONAL, TableDefinition.T0289_COUNTY_PARISH);
            this[10] = new IS("Census Tract", 20, EnumDataUsage.OPTIONAL, TableDefinition.T0288_CENSUS_TRACT);
            this[11] = new ID("Address Representation Code", 1, EnumDataUsage.OPTIONAL, TableDefinition.T0465_NAME_ADDRESS_REPRESENTATION);
            this[12] = new DR("Address Validity Range", 53, EnumDataUsage.BACKWARD_COMPATIBILITY);
            this[13] = new TS("Effective Date", 26, EnumDataUsage.OPTIONAL);
            this[14] = new TS("Expiration Date", 26, EnumDataUsage.OPTIONAL);
        }

        /// <summary>
        /// XAD.1 - Street Address.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public SAD StreetAddress
        {
            get
            {
                SAD ret = null;

                try
                {
                    ret = (SAD)this[1];
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
        /// XAD.2 - Other Designation.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ST OtherDesignation
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
        /// XAD.3 - City.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ST City
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
        /// XAD.4 - State Or Province.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ST StateOrProvince
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
        /// XAD.5 - Zip Or Postal Code.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ST ZipOrPostalCode
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
        /// XAD.6 - Country.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ID Country
        {
            get
            {
                ID ret = null;

                try
                {
                    ret = (ID)this[6];
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
        /// XAD.7 - Address Type.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ID AddressType
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
        /// XAD.8 - Other Geographic Designation.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ST OtherGeographicDesignation
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this[8];
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
        /// XAD.9 - County/Parish Code.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public IS CountyParishCode
        {
            get
            {
                IS ret = null;

                try
                {
                    ret = (IS)this[9];
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
        /// XAD.10 - Census Tract.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public IS CensusTract
        {
            get
            {
                IS ret = null;

                try
                {
                    ret = (IS)this[10];
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
        /// XAD.11 - Address Representation Code.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ID AddressRepresentationCode
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
        /// XAD.12 - Address Validity Range.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public DR AddressValidityRange
        {
            get
            {
                DR ret = null;

                try
                {
                    ret = (DR)this[12];
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
        /// XAD.13 - Effective Date.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public TS EffectiveDate
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
        /// XAD.14 - Expiration Date.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public TS ExpirationDate
        {
            get
            {
                TS ret = null;

                try
                {
                    ret = (TS)this[14];
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
