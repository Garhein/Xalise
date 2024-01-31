using System;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Exceptions;
using Xalise.Interop.HL7.Structure.DataType.Primitive;
using Xalise.Interop.HL7.Structure.Table;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// EI - Entity Identifier.
    /// </summary>
    [Serializable]
    public class EI : AbstractTypeComposite
    {
        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        public EI(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        /// <param name="codeTable">Code de la table de donnée associée</param>
        public EI(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(4, description, maxLength, usage, codeTable)
        {
            this[1] = new ST("Entity Identifier", 199, EnumDataUsage.OPTIONAL);
            this[2] = new IS("Namespace Id", 20, EnumDataUsage.OPTIONAL, TableDefinition.T0363_ASSIGNING_AUTHORITY);
            this[3] = new ST("Universal Id", 199, EnumDataUsage.CONDITIONAL);
            this[4] = new ID("Universal Id Type", 6, EnumDataUsage.CONDITIONAL, TableDefinition.T0301_UNIVERSAL_ID_TYPE);
        }

        /// <summary>
        /// EI.1 - Entity Identifier.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ST EntityIdentifier
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
        /// EI.2 - Namespace Id.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public IS NamespaceId
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
        /// EI.3 - Universal Id.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ST UniversalId
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
        /// EI.4 - Universal Id Type.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ID UniversalIdType
        {
            get
            {
                ID ret = null;

                try
                {
                    ret = (ID)this[4];
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
    }
}
