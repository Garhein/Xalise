using System;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Exceptions;
using Xalise.Interop.HL7.Structure.DataType.Primitive;
using Xalise.Interop.HL7.Structure.Table;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// VID - Version Identifier.
    /// </summary>
    [Serializable]
    public class VID : AbstractTypeComposite
    {
        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        public VID(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        /// <param name="codeTable">Code de la table de donnée associée</param>
        public VID(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(3, description, maxLength, usage, codeTable)
        {
            this[1] = new ID("Version Id", 5, EnumDataUsage.OPTIONAL, TableDefinition.T0104_VERSION_ID);
            this[2] = new CE("Internationalization Code", 483, EnumDataUsage.OPTIONAL, TableDefinition.T0399_COUNTRY_CODE);
            this[3] = new CE("International Version Id", 483, EnumDataUsage.OPTIONAL);
        }

        /// <summary>
        /// VID.1 - Version Id.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ID VersionId
        {
            get
            {
                ID ret = null;

                try
                {
                    ret = (ID)this[1];
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
        /// VID.2 - Internationalization Code.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public CE InternationalizationCode
        {
            get
            {
                CE ret = null;

                try
                {
                    ret = (CE)this[2];
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
        /// VID.3 - International Version Id.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public CE InternationalVersionId
        {
            get
            {
                CE ret = null;

                try
                {
                    ret = (CE)this[3];
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
    }
}
