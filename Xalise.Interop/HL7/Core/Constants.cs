namespace Xalise.Interop.HL7.Core
{
    /// <summary>
    /// Déclaration des constantes.
    /// </summary>
    /// <author>Xavier VILLEMIN - xavier.villemin@gmail.com</author>
    public struct Constants
    {
        public const char DEFAULT_SEP_FIELD             = '|';
        public const char DEFAULT_SEP_COMPONENT         = '^';
        public const char DEFAULT_SEP_REPETITION        = '~';
        public const char DEFAULT_SEP_SUBCOMPONENT      = '&';
        public const char DEFAULT_ESCAPE_CHARACTER      = '\\';
        public const char SEGMENT_DELIMITER             = '\r';
        public const string ESCAPE_FIELD                = @"\F\";
        public const string ESCAPE_COMPONENT            = @"\S\";
        public const string ESCAPE_REPETITION           = @"\R\";
        public const string ESCAPE_CHAR                 = @"\E\";
        public const string ESCAPE_SUBCOMPONENT         = @"\T\";
    }
}
