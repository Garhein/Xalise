using System;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Structure.DataType.Composite;
using Xalise.Interop.HL7.Structure.DataType.Primitive;
using Xalise.Interop.HL7.Structure.Table;

namespace Xalise.Interop.HL7.Structure.Segment
{
    /// <summary>
    /// MSH - Message Header.
    /// </summary>
    /// <remarks>
    /// Le segment MSH définit l'intention, la source, la destination et certaines spécificités
    /// de la syntaxe d'un message.
    /// </remarks>
    [Serializable]
    public class MSH : AbstractSegment
    {
        /// <inheritdoc/>
        public MSH() : base()
        {
            this.InitField(typeof(ST), "Field Separator", 1, 1, EnumDataUsage.REQUIRED);
            this.InitField(typeof(ST), "Encoding Characters", 4, 1, EnumDataUsage.REQUIRED);
            this.InitField(typeof(HD), "Sending Application", 227, 1, EnumDataUsage.OPTIONAL, TableDefinition.T0361_APPLICATION);
            this.InitField(typeof(HD), "Sending Facility", 227, 1, EnumDataUsage.OPTIONAL, TableDefinition.T0362_FACILITY);
            this.InitField(typeof(HD), "Receiving Application", 227, 1, EnumDataUsage.OPTIONAL, TableDefinition.T0361_APPLICATION);
            this.InitField(typeof(HD), "Receiving Facility", 227, 1, EnumDataUsage.OPTIONAL, TableDefinition.T0362_FACILITY);
            this.InitField(typeof(TS), "Receiving Facility", 26, 1, EnumDataUsage.REQUIRED);
            this.InitField(typeof(ST), "Security", 40, 1, EnumDataUsage.OPTIONAL);
            this.InitField(typeof(MSG), "Message Type", 15, 1, EnumDataUsage.REQUIRED);
            this.InitField(typeof(ST), "Message Control ID", 20, 1, EnumDataUsage.REQUIRED);
            this.InitField(typeof(PT), "Processing ID", 3, 1, EnumDataUsage.REQUIRED);
            this.InitField(typeof(VID), "Version ID", 60, 1, EnumDataUsage.REQUIRED);
            this.InitField(typeof(NM), "Sequence Number", 15, 1, EnumDataUsage.OPTIONAL);
            this.InitField(typeof(ST), "Continuation Pointer", 180, 1, EnumDataUsage.OPTIONAL);
            this.InitField(typeof(ID), "Accept Acknowledgment Type", 2, 1, EnumDataUsage.OPTIONAL, TableDefinition.T0155_ACCEPT_APPLICATION_ACK_CONDITIONS);
            this.InitField(typeof(ID), "Application Acknowledgment Type", 2, 1, EnumDataUsage.OPTIONAL, TableDefinition.T0155_ACCEPT_APPLICATION_ACK_CONDITIONS);
            this.InitField(typeof(ID), "Country Code", 3, 1, EnumDataUsage.OPTIONAL, TableDefinition.T0399_COUNTRY_CODE);
            this.InitField(typeof(ID), "Character Set", 16, 0, EnumDataUsage.OPTIONAL, TableDefinition.T0211_ALTERNATE_CHARACTER_SET);
            this.InitField(typeof(CE), "Principal Language Of Message", 250, 1, EnumDataUsage.OPTIONAL);
            this.InitField(typeof(ID), "Alternate Character Set Handling Scheme", 20, 1, EnumDataUsage.OPTIONAL, TableDefinition.T0356_ALTERNATE_CHARACTER_SET_HANDLING_SCHEME);
            this.InitField(typeof(EI), "Message Profile Identifier", 427, 0, EnumDataUsage.OPTIONAL);
        }

        /// <summary>
        /// Récupère le champ <c>Field Separator</c> (MSH-1)..
        /// </summary>
        public ST FieldSeparator
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this.GetField(1, 1);
                }
                catch (Exception)
                {
                    throw;
                }

                return ret;
            }
        }

        /// <summary>
        /// Récupère une répétition précise du champ <c>Message Profile Identifier</c> (MSH-21).
        /// </summary>
        /// <param name="rep">Numéro de la répétition.</param>
        /// <returns></returns>
        public EI GetMessageProfileIdentifier(int rep)
        {
            EI ret = null;

            try
            {
                ret = (EI)this.GetField(21, rep);
            }
            catch (Exception)
            {
                throw;
            }

            return ret;
        }

        /// <summary>
        /// Récupère toutes les répétitions du champ <c>Message Profile Identifier</c> (MSH-21).
        /// </summary>
        /// <returns></returns>
        public EI[] GetMessageProfileIdentifier()
        {
            EI[] ret = null;

            try
            {
                IType[] reps = this.GetField(21);
                
                ret = new EI[reps.Length];

                for (int i = 0; i < ret.Length; i++)
                {
                    ret[i] = (EI)reps[i];
                }
            }
            catch (Exception)
            {
                throw;
            }

            return ret;
        }

        /// <summary>
        /// Récupère le nombre de répétitions du champ <c>Message Profile Identifier"</c> (MSH-21).
        /// </summary>
        public int MessageProfileIdentifierTotalRepetitions
        {
            get
            {
                try
                {
                    return this.GetTotalFieldRepetitions(21);
                }
                catch (Exception)
                {
                    throw;
                }
            }
        }
    }
}
