using System;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Exceptions;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// DR - Date/Time Range.
    /// </summary>
    [Serializable]
    public class DR : AbstractTypeComposite
    {
        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        public DR(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        /// <param name="codeTable">Code de la table de donnée associée</param>
        public DR(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(2, description, maxLength, usage, codeTable)
        {
            this[1] = new TS("Range Start Date/Time", 26, EnumDataUsage.OPTIONAL);
            this[2] = new TS("Range End Date/Time", 26, EnumDataUsage.OPTIONAL);
        }

        /// <summary>
        /// DR.1 - Range Start Date/Time.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public TS RangeStartDateTime
        {
            get
            {
                TS ret = null;

                try
                {
                    ret = (TS)this[1];
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
        /// DR.2 - Range End Date/Time.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public TS RangeEndDateTime
        {
            get
            {
                TS ret = null;

                try
                {
                    ret = (TS)this[2];
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
