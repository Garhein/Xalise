using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Structure.DataTable;
using Xalise.Interop.HL7.Structure.DataType.Composite;
using Xalise.Interop.HL7.Structure.DataType.Primitive;

namespace Xalise.Interop.HL7.Structure.Segment
{
    /// <summary>
    /// MSH - Message Header.
    /// </summary>
    /// <author>Xavier VILLEMIN - xavier.villemin@gmail.com</author>
    [Serializable]
    public class MSH : AbstractSegment
    {
        /// <summary>
        /// Constructeur.
        /// </summary>
        public MSH() : base()
        {
            this.AddField(typeof(ST), "Field Separator", 1, 1, EnumDataUsage.REQUIRED);
            this.AddField(typeof(ST), "Encoding Characters", 4, 1, EnumDataUsage.REQUIRED);
            this.AddField(typeof(HD), "Sending Application", 227, 1, EnumDataUsage.OPTIONAL, DataTableCodeDefinition.T0361_APPLICATION);
            this.AddField(typeof(HD), "Sending Facility", 227, 1, EnumDataUsage.OPTIONAL, DataTableCodeDefinition.T0362_FACILITY);
            this.AddField(typeof(HD), "Receiving Application", 227, 1, EnumDataUsage.OPTIONAL, DataTableCodeDefinition.T0361_APPLICATION);
            this.AddField(typeof(HD), "Receiving Facility", 227, 1, EnumDataUsage.OPTIONAL, DataTableCodeDefinition.T0362_FACILITY);
            this.AddField(typeof(TS), "Date/Time Of Message", 26, 1, EnumDataUsage.REQUIRED);
            this.AddField(typeof(ST), "Security", 40, 1, EnumDataUsage.OPTIONAL);
            this.AddField(typeof(MSG), "Message Type", 15, 1, EnumDataUsage.REQUIRED);
            this.AddField(typeof(ST), "Message Control ID", 20, 1, EnumDataUsage.REQUIRED);
            this.AddField(typeof(PT), "Processing ID", 3, 1, EnumDataUsage.REQUIRED);
            this.AddField(typeof(VID), "Version ID", 60, 1, EnumDataUsage.REQUIRED);
            this.AddField(typeof(NM), "Sequence Number", 15, 1, EnumDataUsage.OPTIONAL);
            this.AddField(typeof(ST), "Continuation Pointer", 180, 1, EnumDataUsage.OPTIONAL);
            this.AddField(typeof(ID), "Accept Acknowledgment Type", 2, 1, EnumDataUsage.OPTIONAL, DataTableCodeDefinition.T0155_ACCEPT_APPLICATION_ACK_CONDITIONS);
            this.AddField(typeof(ID), "Application Acknowledgment Type", 2, 1, EnumDataUsage.OPTIONAL, DataTableCodeDefinition.T0155_ACCEPT_APPLICATION_ACK_CONDITIONS);
            this.AddField(typeof(ID), "Country Code", 3, 1, EnumDataUsage.OPTIONAL, DataTableCodeDefinition.T0399_COUNTRY_CODE);
            this.AddField(typeof(ID), "Character Set", 16, 0, EnumDataUsage.OPTIONAL, DataTableCodeDefinition.T0211_ALTERNATE_CHARACTER_SET);
            this.AddField(typeof(CE), "Principal Language Of Message", 250, 1, EnumDataUsage.OPTIONAL);
            this.AddField(typeof(ID), "Alternate Character Set Handling Scheme", 20, 1, EnumDataUsage.OPTIONAL, DataTableCodeDefinition.T0356_ALTERNATE_CHARACTER_SET_HANDLING_SCHEME);
            this.AddField(typeof(EI), "Message Profile Identifier", 427, 0, EnumDataUsage.OPTIONAL);
        }

        /// <summary>
        /// Récupère le champ MSH-1.
        /// </summary>
        public ST FieldSeparator => this.GetField<ST>(1, 1);

        /// <summary>
        /// Récupère le champ MSH-2.
        /// </summary>
        public ST EncodingCharacters => this.GetField<ST>(2, 1);

        /// <summary>
        /// Récupère le champ MSH-3.
        /// </summary>
        public HD SendingApplication => this.GetField<HD>(3, 1);

        /// <summary>
        /// Récupère le champ MSH-4.
        /// </summary>
        public HD SendingFacility => this.GetField<HD>(4, 1);

        /// <summary>
        /// Récupère le champ MSH-5.
        /// </summary>
        public HD ReceivingApplication => this.GetField<HD>(5, 1);

        /// <summary>
        /// Récupère le champ MSH-6.
        /// </summary>
        public HD ReceivingFacility => this.GetField<HD>(6, 1);

        /// <summary>
        /// Récupère le champ MSH-7.
        /// </summary>
        public TS DateTimeOfMessage => this.GetField<TS>(7, 1);

        /// <summary>
        /// Récupère le champ MSH-8.
        /// </summary>
        public ST Security => this.GetField<ST>(8, 1);

        /// <summary>
        /// Récupère le champ MSH-9.
        /// </summary>
        public MSG MessageType => this.GetField<MSG>(9, 1);

        /// <summary>
        /// Récupère le champ MSH-10.
        /// </summary>
        public ST MessageControlID => this.GetField<ST>(10, 1);

        /// <summary>
        /// Récupère le champ MSH-11.
        /// </summary>
        public PT ProcessingID => this.GetField<PT>(11, 1);

        /// <summary>
        /// Récupère le champ MSH-12.
        /// </summary>
        public VID VersionID => this.GetField<VID>(12, 1);

        /// <summary>
        /// Récupère le champ MSH-13.
        /// </summary>
        public NM SequenceNumber => this.GetField<NM>(13, 1);

        /// <summary>
        /// Récupère le champ MSH-14.
        /// </summary>
        public ST ContinuationPointer => this.GetField<ST>(14, 1);

        /// <summary>
        /// Récupère le champ MSH-15.
        /// </summary>
        public ID AcceptAcknowledgmentType => this.GetField<ID>(15, 1);

        /// <summary>
        /// Récupère le champ MSH-16.
        /// </summary>
        public ID ApplicationAcknowledgmentType => this.GetField<ID>(16, 1);

        /// <summary>
        /// Récupère le champ MSH-17.
        /// </summary>
        public ID GetCountryCode => this.GetField<ID>(17, 1);

        /// <summary>
        /// Récupère une répétition du champ MSH-18.
        /// </summary>
        /// <param name="repNumber">Index de la répétition à récupérer.</param>
        /// <returns></returns>
        public ID GetCharacterSet(int repNumber)
        {
            return this.GetField<ID>(18, repNumber);
        }

        /// <summary>
        /// Récupère les répétitions du champs MSH-18.
        /// </summary>
        /// <returns></returns>
        public ID[] GetCharacterSet()
        {
            return this.GetField<ID>(18);
        }

        /// <summary>
        /// Récupère le champ MSH-19.
        /// </summary>
        public CE PrincipalLanguageOfMessage => this.GetField<CE>(19, 1);

        /// <summary>
        /// Récupère le champ MSH-20.
        /// </summary>
        public ID AlternateCharacterSetHandlingScheme => this.GetField<ID>(20, 1);

        /// <summary>
        /// Récupère une répétition du champ MSH-21.
        /// </summary>
        /// <param name="repNumber">Index de la répétition à récupérer.</param>
        /// <returns></returns>
        public EI GetMessageProfileIdentifier(int repNumber)
        {
            return this.GetField<EI>(21, repNumber);
        }

        /// <summary>
        /// Récupère les répétitions du champs MSH-21.
        /// </summary>
        /// <returns></returns>
        public EI[] GetMessageProfileIdentifier()
        {
            return this.GetField<EI>(21);
        }
    }
}
