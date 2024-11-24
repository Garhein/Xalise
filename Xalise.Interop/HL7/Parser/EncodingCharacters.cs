using Xalise.Core.Extensions;
using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Core;

namespace Xalise.Interop.HL7.Parser
{
    /// <summary>
    /// Caractères d'encodage des messages HL7.
    /// </summary>
    /// <author>Xavier VILLEMIN - xavier.villemin@gmail.com</author>
    [Serializable]
    public class EncodingCharacters
    {
        private char _fieldSeparator;
        private char _componentSeparator;
        private char _repetitionSeparator;
        private char _espaceCharacter;
        private char _subComponentSeparator;

        /// <summary>
        /// Constructeur prenant en charge les caractères d'encodage par défaut.
        /// </summary>
        public EncodingCharacters() : this(Constants.DEFAULT_SEP_FIELD, string.Empty) { }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="fieldSeparator">Séparateur de champ.</param>
        /// <param name="componentSeparator">Séparateur de composant.</param>
        /// <param name="repetitionSeparator">Séparateur de répétition.</param>
        /// <param name="escapeCharacter">Caractère d'échappement des caractères réservés.</param>
        /// <param name="subComponentSeparator">Séparateur de sous-composant.</param>
        public EncodingCharacters(
                char fieldSeparator,
                char componentSeparator,
                char repetitionSeparator,
                char escapeCharacter,
                char subComponentSeparator)
                : this(
                    fieldSeparator,
                    new string(new char[] { componentSeparator, repetitionSeparator, escapeCharacter, subComponentSeparator })
                ) { }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="fieldSeparator">Séparateur de champ.</param>
        /// <param name="encodingCharacters">Caractères d'encodage indiqué dans l'ordre suivant : composant, répétition, caractère d'échappement et sous-composant.</param>
        /// <exception cref="HL7Exception">
        /// Si l'une des conditions suivantes est vérifiée :<br/>
        /// - <paramref name="fieldSeparator"/> est un espace ou un caractère non imprimable.<br/>
        /// - <paramref name="encodingCharacters"/> contient au moins un espace ou un caractère non imprimable.<br/>
        /// - <paramref name="encodingCharacters"/> n'est pas composée de caractères uniques.
        /// </exception>
        public EncodingCharacters(char fieldSeparator, string encodingCharacters)
        {
            if (char.IsWhiteSpace(fieldSeparator) || fieldSeparator == char.MinValue) 
            {
                throw new HL7Exception("Le séparateur de champ doit être un caractère imprimable.");
            }

            if (encodingCharacters.IsNullOrWhiteSpace())
            {
                this._componentSeparator    = Constants.DEFAULT_SEP_COMPONENT;
                this._repetitionSeparator   = Constants.DEFAULT_SEP_REPETITION;
                this._espaceCharacter       = Constants.DEFAULT_ESCAPE_CHARACTER;
                this._subComponentSeparator = Constants.DEFAULT_SEP_SUBCOMPONENT;
            }
            else
            {
                if (encodingCharacters.Any(x => char.IsWhiteSpace(x) || x == char.MinValue))
                {
                    throw new HL7Exception("Les caractères d'encodage doivent être des caractères imprimables.");
                }

                if (!encodingCharacters.CharsAreUnique()) 
                {
                    throw new HL7Exception("Les caractères d'encodage doivent être uniques.");
                }

                this._componentSeparator    = encodingCharacters[0];
                this._repetitionSeparator   = encodingCharacters[1];
                this._espaceCharacter       = encodingCharacters[2];
                this._subComponentSeparator = encodingCharacters[3];
            }
        }

        /// <summary>
        /// Séparateur de champ.
        /// </summary>
        public char FieldSeparator => this._fieldSeparator;

        /// <summary>
        /// Séparateur de composant.
        /// </summary>
        public char ComponentSeparator => this._componentSeparator;

        /// <summary>
        /// Séparateur de répétition.
        /// </summary>
        public char RepetitionSeparator => this._repetitionSeparator;

        /// <summary>
        /// Caractère d'échappement des caractères réservés.
        /// </summary>
        public char EscapeCharacter => this._espaceCharacter;

        /// <summary>
        /// Séparateur de sous-composant.
        /// </summary>
        public char SubComponentSeparator => this._subComponentSeparator;
    }
}
