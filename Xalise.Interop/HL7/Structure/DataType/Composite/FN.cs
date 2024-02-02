using System;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Exceptions;
using Xalise.Interop.HL7.Structure.DataType.Primitive;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// FN - Family Name.
    /// </summary>
    [Serializable]
    public class FN : AbstractTypeComposite
    {
        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        public FN(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        /// <param name="codeTable">Code de la table de donnée associée</param>
        public FN(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(5, description, maxLength, usage, codeTable)
        {
            this[1] = new ST("Surname", 50, EnumDataUsage.REQUIRED);
            this[2] = new ST("Own Surname Prefix", 20, EnumDataUsage.OPTIONAL);
            this[3] = new ST("Own Surname", 50, EnumDataUsage.OPTIONAL);
            this[4] = new ST("Surname Prefix From Partner/Spouse", 20, EnumDataUsage.OPTIONAL);
            this[5] = new ST("Surname From Partner/Spouse", 50, EnumDataUsage.OPTIONAL);
        }

        /// <summary>
        /// FN.1 - Surname.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public ST Surname
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
        /// FN.2 - Own Surname Prefix.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public ST OwnSurnamePrefix
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
        /// FN.3 - Own Surname.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public ST OwnSurname
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
        /// FN.4 - Surname Prefix From Partner/Spouse.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public ST SurnamePrefixFromPartnerSpouse
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
        /// FN.5 - Surname From Partner/Spouse.
        /// </summary>
        /// <exception cref="InteropHL7Exception">Si erreur à l'accès au composant.</exception>
        public ST SurnameFromPartnerSpouse
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
    }
}
