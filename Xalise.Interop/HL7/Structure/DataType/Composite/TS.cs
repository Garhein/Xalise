using System;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Exceptions;
using Xalise.Interop.HL7.Structure.DataType.Primitive;
using Xalise.Interop.HL7.Structure.Table;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// TS - Time Stamp.
    /// </summary>
    [Serializable]
    public class TS : AbstractTypeComposite
    {
        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        public TS(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        /// <param name="codeTable">Code de la table de donnée associée</param>
        public TS(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(2, description, maxLength, usage, codeTable)
        {
            this[1] = new DTM("Time", 24, EnumDataUsage.REQUIRED);
            this[2] = new ID("Degree Of Precision", 1, EnumDataUsage.BACKWARD_COMPATIBILITY, TableDefinition.T0529_PRECISION);
        }

        /// <summary>
        /// TS.1 - Time.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public DTM Time
        {
            get
            {
                DTM ret = null;

                try
                {
                    ret = (DTM)this[1];
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
        /// TS.2 - Degree Of Precision.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public ID DegreeOfPrecision
        {
            get
            {
                ID ret = null;

                try
                {
                    ret = (ID)this[2];
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
    }
}
