using System;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Structure.DataType.Composite;
using Xalise.Interop.HL7.Structure.DataType.Primitive;
using Xalise.Interop.HL7.Structure.Table;

namespace Xalise.Interop.HL7.Structure.Segment
{
    [Serializable]
    public class MSH : AbstractSegment
    {
        public MSH(IGroup parent) : base(parent)
        {
            this.AddField(typeof(ST), "Field Separator", 1, 1, EnumDataUsage.REQUIRED);
            this.AddField(typeof(ST), "Encoding Characters", 4, 1, EnumDataUsage.REQUIRED);
            this.AddField(typeof(HD), "Sending Application", 227, 1, EnumDataUsage.REQUIRED);
            this.AddField(typeof(HD), "Sending Facility", 227, 1, EnumDataUsage.REQUIRED);
            this.AddField(typeof(HD), "Receiving Application", 227, 1, EnumDataUsage.REQUIRED);
            this.AddField(typeof(HD), "Receiving Facility", 227, 1, EnumDataUsage.REQUIRED);
            this.AddField(typeof(TS), "Date/Time of Message", 26, 1, EnumDataUsage.REQUIRED);
            this.AddField(typeof(ST), "Security", 40, 1, EnumDataUsage.FORBIDDEN);
            this.AddField(typeof(MSG), "Message Type", 15, 1, EnumDataUsage.REQUIRED);
            this.AddField(typeof(ST), "Message Control Id", 20, 1, EnumDataUsage.REQUIRED);
            this.AddField(typeof(PT), "Processing Id", 3, 1, EnumDataUsage.REQUIRED);
            this.AddField(typeof(VID), "Version ID", 60, 1, EnumDataUsage.REQUIRED);
            this.AddField(typeof(NM), "Sequence Number", 15, 1, EnumDataUsage.OPTIONAL);
            this.AddField(typeof(ST), "Continuation Pointer", 180, 1, EnumDataUsage.FORBIDDEN);
            this.AddField(typeof(ID), "Accept Acknowledgement Type", 2, 1, EnumDataUsage.OPTIONAL, TableCodeDefinition.T0155_ACCEPT_APPLICATION_ACK_CONDITIONS);
            this.AddField(typeof(ID), "Application Acknowledgement Type", 2, 1, EnumDataUsage.OPTIONAL, TableCodeDefinition.T0155_ACCEPT_APPLICATION_ACK_CONDITIONS);
            this.AddField(typeof(ID), "Country Code", 3, 1, EnumDataUsage.REQUIRED_OR_EMPTY, TableCodeDefinition.T0399_COUNTRY_CODE);
            this.AddField(typeof(ID), "Character Set", 16, 1, EnumDataUsage.CONDITIONAL, TableCodeDefinition.T0211_ALTERNATE_CHARACTER_SET);
            this.AddField(typeof(CE), "Principal Language of Message", 250, 1, EnumDataUsage.REQUIRED_OR_EMPTY);
            this.AddField(typeof(ID), "Alternate Character Set Handling Scheme", 20, 1, EnumDataUsage.FORBIDDEN, TableCodeDefinition.T0356_ALTERNATE_CHARACTER_SET_HANDLING_SCHEME);
            this.AddField(typeof(EI), "Message Profile Identifier", 427, 0, EnumDataUsage.REQUIRED_OR_EMPTY);
        }

        /// <summary>
        /// MSH-1 : Field Separator.
        /// </summary>
        public ST FieldSeparator
        {
            get
            {
                return this.GetField<ST>(1, 1);
            }
        }

        /// <summary>
        /// MSH-2 : Encoding Characters.
        /// </summary>
        public ST EncodingCharacters
        {
            get
            {
                return this.GetField<ST>(2, 1);
            }
        }

        /// <summary>
        /// MSH-3 : Sending Application.
        /// </summary>
        public HD SendingApplication
        {
            get
            {
                return this.GetField<HD>(3, 1);
            }
        }

        /// <summary>
        /// MSH-4 : Sending Facility.
        /// </summary>
        public HD SendingFacility
        {
            get
            {
                return this.GetField<HD>(4, 1);
            }
        }

        /// <summary>
        /// MSH-5 : Receiving Application.
        /// </summary>
        public HD ReceivingApplication
        {
            get
            {
                return this.GetField<HD>(5, 1);
            }
        }

        /// <summary>
        /// MSH-6 : Receiving Facility.
        /// </summary>
        public HD ReceivingFacility
        {
            get
            {
                return this.GetField<HD>(6, 1);
            }
        }

        /// <summary>
        /// MSH-7 : Date/Time of Message.
        /// </summary>
        public TS DateTimeOfMessage
        {
            get
            {
                return this.GetField<TS>(7, 1);
            }
        }

        /// <summary>
        /// MSH-8 : Security.
        /// </summary>
        public ST Security
        {
            get
            {
                return this.GetField<ST>(8, 1);
            }
        }

        /// <summary>
        /// MSH-9 : Message Type.
        /// </summary>
        public MSG MessageType
        {
            get
            {
                return this.GetField<MSG>(9, 1);
            }
        }

        /// <summary>
        /// MSH-10 : Message Control Id.
        /// </summary>
        public ST MessageControlID
        {
            get
            {
                return this.GetField<ST>(10, 1);
            }
        }

        /// <summary>
        /// MSH-11 : Processing Id.
        /// </summary>
        public PT ProcessingID
        {
            get
            {
                return this.GetField<PT>(11, 1);
            }
        }

        /// <summary>
        /// MSH-12 : Version ID.
        /// </summary>
        public VID VersionID
        {
            get
            {
                return this.GetField<VID>(12, 1);
            }
        }

        /// <summary>
        /// MSH-13 : Sequence Number.
        /// </summary>
        public NM SequenceNumber
        {
            get
            {
                return this.GetField<NM>(13, 1);
            }
        }

        /// <summary>
        /// MSH-14 : Continuation Pointer.
        /// </summary>
        public ST ContinuationPointer
        {
            get
            {
                return this.GetField<ST>(14, 1);
            }
        }

        /// <summary>
        /// MSH-15 : Accept Acknowledgement Type.
        /// </summary>
        public ID AcceptAcknowledgementType
        {
            get
            {
                return this.GetField<ID>(15, 1);
            }
        }

        /// <summary>
        /// MSH-16 : Application Acknowledgement Type.
        /// </summary>
        public ID ApplicationAcknowledgementType
        {
            get
            {
                return this.GetField<ID>(16, 1);
            }
        }

        /// <summary>
        /// MSH-17 : Country Code.
        /// </summary>
        public ID CountryCode
        {
            get
            {
                return this.GetField<ID>(17, 1);
            }
        }

        /// <summary>
        /// MSH-18 : Character Set.
        /// </summary>
        public ID CharacterSet
        {
            get
            {
                return this.GetField<ID>(18, 1);
            }
        }

        /// <summary>
        /// MSH-19 : Alternate Character Set Handling Scheme.
        /// </summary>
        public CE PrincipalLanguageOfMessage
        {
            get
            {
                return this.GetField<CE>(19, 1);
            }
        }

        /// <summary>
        /// MSH-20 : Alternate Character Set Handling Scheme.
        /// </summary>
        public ID AlternateCharacterSetHandlingScheme
        {
            get
            {
                return this.GetField<ID>(20, 1);
            }
        }

        /// <summary>
        /// MSH-21 : Message Profile Identifier.
        /// </summary>
        /// <param name="repNumber"></param>
        /// <returns></returns>
        public EI GetMessageProfileIdentifier(int repNumber)
        {
            return this.GetField<EI>(21, repNumber);
        }

        /// <summary>
        /// MSH-21 : Message Profile Identifier.
        /// </summary>
        /// <returns></returns>
        public EI[] GetMessageProfileIdentifier()
        {
            return this.GetField<EI>(21);
        }

        /// <summary>
        /// Récupère le nombre de répétitions du champ 'Message Profile Identifier' (MSH-21).
        /// </summary>
        public int MessageProfileIdentifierTotalRepetitions
        {
            get
            {
                return this.GetTotalFieldRepetitions(21);
            }
        }
    }
}
