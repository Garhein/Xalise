using System;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Exceptions;
using Xalise.Interop.HL7.Structure.DataType.Primitive;
using Xalise.Interop.HL7.Structure.Table;

namespace Xalise.Interop.HL7.Structure.DataType.Composite
{
    /// <summary>
    /// MSG - Message Type.
    /// </summary>
    [Serializable]
    public class MSG : AbstractTypeComposite
    {
        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        public MSG(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        /// <param name="codeTable">Code de la table de donnée associée</param>
        public MSG(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(3, description, maxLength, usage, codeTable)
        {
            this[1] = new ID("Message Code", 3, EnumDataUsage.REQUIRED, TableDefinition.T0076_MESSAGE_TYPE);
            this[2] = new ID("Trigger Event", 3, EnumDataUsage.REQUIRED, TableDefinition.T0003_EVENT_TYPE);
            this[3] = new ID("Message Structure", 7, EnumDataUsage.REQUIRED, TableDefinition.T0354_MESSAGE_STRUCTURE);
        }

        /// <summary>
        /// MSG.1 - Message Code.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ID MessageCode
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
        /// MSG.2 - Trigger Event.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ID TriggerEvent
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
        /// MSG.3 - Message Structure.
        /// </summary>
        /// <exception cref="DataTypeException">Si erreur à l'accès au composant.</exception>
        public ID MessageStructure
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
    }
}
