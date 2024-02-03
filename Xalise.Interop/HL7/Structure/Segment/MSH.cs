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
            this.InitField(typeof(TS), "Date/Time Of Message", 26, 1, EnumDataUsage.REQUIRED);
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
        /// Récupère le champ <c>Field Separator</c> (MSH-1).
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
        /// Récupère le champ <c>Encoding Characters</c> (MSH-2).
        /// </summary>
        public ST EncodingCharacters
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this.GetField(2, 1);
                }
                catch (Exception)
                {
                    throw;
                }

                return ret;
            }
        }

        /// <summary>
        /// Récupère le champ <c>Sending Application</c> (MSH-3).
        /// </summary>
        public HD SendingApplication
        {
            get
            {
                HD ret = null;

                try
                {
                    ret = (HD)this.GetField(3, 1);
                }
                catch (Exception)
                {
                    throw;
                }

                return ret;
            }
        }

        /// <summary>
        /// Récupère le champ <c>Sending Facility</c> (MSH-4).
        /// </summary>
        public HD SendingFacility
        {
            get
            {
                HD ret = null;

                try
                {
                    ret = (HD)this.GetField(4, 1);
                }
                catch (Exception)
                {
                    throw;
                }

                return ret;
            }
        }

        /// <summary>
        /// Récupère le champ <c>Receiving Application</c> (MSH-5).
        /// </summary>
        public HD ReceivingApplication
        {
            get
            {
                HD ret = null;

                try
                {
                    ret = (HD)this.GetField(5, 1);
                }
                catch (Exception)
                {
                    throw;
                }

                return ret;
            }
        }

        /// <summary>
        /// Récupère le champ <c>Receiving Facility</c> (MSH-6).
        /// </summary>
        public HD ReceivingFacility
        {
            get
            {
                HD ret = null;

                try
                {
                    ret = (HD)this.GetField(6, 1);
                }
                catch (Exception)
                {
                    throw;
                }

                return ret;
            }
        }

        /// <summary>
        /// Récupère le champ <c>Date/Time Of Message</c> (MSH-7).
        /// </summary>
        public TS DateTimeOfMessage
        {
            get
            {
                TS ret = null;

                try
                {
                    ret = (TS)this.GetField(7, 1);
                }
                catch (Exception)
                {
                    throw;
                }

                return ret;
            }
        }

        /// <summary>
        /// Récupère le champ <c>Security</c> (MSH-8).
        /// </summary>
        public ST Security
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this.GetField(8, 1);
                }
                catch (Exception)
                {
                    throw;
                }

                return ret;
            }
        }

        /// <summary>
        /// Récupère le champ <c>Message Type</c> (MSH-9).
        /// </summary>
        public MSG MessageType
        {
            get
            {
                MSG ret = null;

                try
                {
                    ret = (MSG)this.GetField(9, 1);
                }
                catch (Exception)
                {
                    throw;
                }

                return ret;
            }
        }

        /// <summary>
        /// Récupère le champ <c>Message Control ID</c> (MSH-10).
        /// </summary>
        public ST MessageControlID
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this.GetField(10, 1);
                }
                catch (Exception)
                {
                    throw;
                }

                return ret;
            }
        }

        /// <summary>
        /// Récupère le champ <c>Processing ID</c> (MSH-11).
        /// </summary>
        public PT ProcessingID
        {
            get
            {
                PT ret = null;

                try
                {
                    ret = (PT)this.GetField(11, 1);
                }
                catch (Exception)
                {
                    throw;
                }

                return ret;
            }
        }

        /// <summary>
        /// Récupère le champ <c>Version ID</c> (MSH-12).
        /// </summary>
        public VID VersionID
        {
            get
            {
                VID ret = null;

                try
                {
                    ret = (VID)this.GetField(12, 1);
                }
                catch (Exception)
                {
                    throw;
                }

                return ret;
            }
        }

        /// <summary>
        /// Récupère le champ <c>Sequence Number</c> (MSH-13).
        /// </summary>
        public NM SequenceNumber
        {
            get
            {
                NM ret = null;

                try
                {
                    ret = (NM)this.GetField(13, 1);
                }
                catch (Exception)
                {
                    throw;
                }

                return ret;
            }
        }

        /// <summary>
        /// Récupère le champ <c>Continuation Pointer</c> (MSH-14).
        /// </summary>
        public ST ContinuationPointer
        {
            get
            {
                ST ret = null;

                try
                {
                    ret = (ST)this.GetField(14, 1);
                }
                catch (Exception)
                {
                    throw;
                }

                return ret;
            }
        }

        /// <summary>
        /// Récupère le champ <c>Accept Acknowledgment Type</c> (MSH-15).
        /// </summary>
        public ID AcceptAcknowledgmentType
        {
            get
            {
                ID ret = null;

                try
                {
                    ret = (ID)this.GetField(15, 1);
                }
                catch (Exception)
                {
                    throw;
                }

                return ret;
            }
        }

        /// <summary>
        /// Récupère le champ <c>Accept Acknowledgment Type</c> (MSH-16).
        /// </summary>
        public ID ApplicationAcknowledgmentType
        {
            get
            {
                ID ret = null;

                try
                {
                    ret = (ID)this.GetField(16, 1);
                }
                catch (Exception)
                {
                    throw;
                }

                return ret;
            }
        }

        /// <summary>
        /// Récupère le champ <c>Country Code</c> (MSH-17).
        /// </summary>
        public ID CountryCode
        {
            get
            {
                ID ret = null;

                try
                {
                    ret = (ID)this.GetField(17, 1);
                }
                catch (Exception)
                {
                    throw;
                }

                return ret;
            }
        }

        /// <summary>
        /// Récupère une répétition précise du champ <c>Character Set</c> (MSH-18).
        /// </summary>
        /// <param name="rep">Numéro de la répétition.</param>
        /// <returns></returns>
        public ID GetCharacterSet(int rep)
        {
            ID ret = null;

            try
            {
                ret = (ID)this.GetField(18, rep);
            }
            catch (Exception)
            {
                throw;
            }

            return ret;
        }

        /// <summary>
        /// Récupère toutes les répétitions du champ <c>Character Set</c> (MSH-18).
        /// </summary>
        /// <returns></returns>
        public ID[] GetCharacterSet()
        {
            ID[] ret = null;

            try
            {
                IType[] reps = this.GetField(18);

                ret = new ID[reps.Length];

                for (int i = 0; i < ret.Length; i++)
                {
                    ret[i] = (ID)reps[i];
                }
            }
            catch (Exception)
            {
                throw;
            }

            return ret;
        }

        /// <summary>
        /// Récupère le nombre de répétitions du champ <c>Character Set</c> (MSH-18).
        /// </summary>
        public int CharacterSetTotalRepetitions
        {
            get
            {
                try
                {
                    return this.GetTotalFieldRepetitions(18);
                }
                catch (Exception)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// Récupère le champ <c>Principal Language Of Message</c> (MSH-19).
        /// </summary>
        public CE PrincipalLanguageOfMessage
        {
            get
            {
                CE ret = null;

                try
                {
                    ret = (CE)this.GetField(19, 1);
                }
                catch (Exception)
                {
                    throw;
                }

                return ret;
            }
        }

        /// <summary>
        /// Récupère le champ <c>Alternate Character Set Handling Scheme</c> (MSH-20).
        /// </summary>
        public ID AlternateCharacterSetHandlingScheme
        {
            get
            {
                ID ret = null;

                try
                {
                    ret = (ID)this.GetField(20, 1);
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
        /// Récupère le nombre de répétitions du champ <c>Message Profile Identifier</c> (MSH-21).
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
