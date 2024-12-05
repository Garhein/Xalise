using System;
using System.Collections.Generic;
using Xalise.Core.Extensions;
using Xalise.Interop.HL7.Core;

namespace Xalise.Tests
{
    public class StringExtensionTests
    {
        [Test]
        public void IsNullOrEmpty_Null()
        {
            string? str = null;
            Assert.That(str.IsNullOrEmpty(), Is.True);
        }

        [Test]
        public void IsNullOrEmpty_Empty()
        {
            string str = string.Empty;
            Assert.That(str.IsNullOrEmpty(), Is.True);
        }

        [Test]
        public void IsNotNullOrEmpty()
        {
            string str = "value";
            Assert.That(str.IsNotNullOrEmpty(), Is.True);
        }

        [Test]
        public void IsNullOrWhiteSpace_Null()
        {
            string? str = null;
            Assert.That(str.IsNullOrWhiteSpace(), Is.True);
        }

        [Test]
        public void IsNullOrWhiteSpace_Empty()
        {
            string str = string.Empty;
            Assert.That(str.IsNullOrWhiteSpace(), Is.True);
        }

        [Test]
        public void IsNullOrWhiteSpace_WhiteSpace()
        {
            string str = "   ";
            Assert.That(str.IsNullOrWhiteSpace(), Is.True);
        }

        [Test]
        public void IsNotNullOrWhiteSpace()
        {
            string str = "value";
            Assert.That(str.IsNotNullOrWhiteSpace(), Is.True);
        }
        
        [Test]
        public void Truncate_TooLongLeft()
        {
            string str = "value";
            Assert.That(str.Truncate(3), Is.EqualTo("val"));
        }

        [Test]
        public void Truncate_TooLongRight()
        {
            string str = "value";
            Assert.That(str.Truncate(3, false), Is.EqualTo("lue"));
        }

        [Test]
        public void Truncate_TooShortLeft()
        {
            string str = "value";
            Assert.That(str.Truncate(10), Is.EqualTo("value"));
        }

        [Test]
        public void Truncate_TooShortRight()
        {
            string str = "value";
            Assert.That(str.Truncate(10, false), Is.EqualTo("value"));
        }

        [Test]
        public void Truncate_InvalidMaxLength()
        {
            string str = "value";
            Assert.Throws<ArgumentException>(
                delegate { 
                    str.Truncate(0); 
                }
            );
        }
        
        [Test]
        public void CharsAreUnique_IsValid()
        {
            string str = "value";
            Assert.That(str.CharsAreUnique(), Is.True);
        }

        [Test]
        public void CharsAreUnique_NotValid()
        {
            string str = "vaaluee";
            Assert.That(str.CharsAreUnique(), Is.False);
        }

        [Test]
        public void CharsAreUnique_InvalidSource()
        {
            string str = "  ";
            Assert.Throws<ArgumentException>(
                delegate {
                    str.CharsAreUnique();
                }
            );
        }

        [Test]
        public void RemoveIdenticalSuccessiveChars_FromLeft()
        {
            string str = "3|2|1|||||";
            Assert.That(str.RemoveIdenticalSuccessiveChars('|', false), Is.EqualTo("3|2|1"));
        }

        [Test]
        public void RemoveIdenticalSuccessiveChars_FromLeftOneChar()
        {
            string str = "3|2|1|";
            Assert.That(str.RemoveIdenticalSuccessiveChars('|', false), Is.EqualTo("3|2|1"));
        }

        [Test]
        public void RemoveIdenticalSuccessiveChars_FromRight()
        {
            string str = "|||||1|2|3";
            Assert.That(str.RemoveIdenticalSuccessiveChars('|'), Is.EqualTo("1|2|3"));
        }

        [Test]
        public void RemoveIdenticalSuccessiveChars_FromRightOneChar()
        {
            string str = "|1|2|3";
            Assert.That(str.RemoveIdenticalSuccessiveChars('|'), Is.EqualTo("1|2|3"));
        }

        [Test]
        public void RemoveIdenticalSuccessiveChars_WithoutCharsToRemove()
        {
            string str = "3|2|1";
            Assert.That(str.RemoveIdenticalSuccessiveChars('|', false), Is.EqualTo("3|2|1"));
        }

        [Test]
        public void RemoveIdenticalSuccessiveChars_InvalidSource()
        {
            string str = "  ";
            Assert.Throws<ArgumentException>(
                delegate {
                    str.RemoveIdenticalSuccessiveChars('|');
                }
            );
        }

        [Test]
        public void EscapeText_Valid()
        {
            string strToEscape              = @"|NOM^PRENOM~PRENOM^NOM&\VAL1|";
            string strEscape                = @"\F\NOM\S\PRENOM\R\PRENOM\S\NOM\T\\E\VAL1\F\";
            Dictionary<char, string> dico   = new Dictionary<char, string>
            {
                { Constants.DEFAULT_SEP_FIELD, Constants.ESCAPE_FIELD },
                { Constants.DEFAULT_SEP_COMPONENT, Constants.ESCAPE_COMPONENT },
                { Constants.DEFAULT_SEP_REPETITION, Constants.ESCAPE_REPETITION },
                { Constants.DEFAULT_ESCAPE_CHARACTER, Constants.ESCAPE_CHAR },
                { Constants.DEFAULT_SEP_SUBCOMPONENT, Constants.ESCAPE_SUBCOMPONENT }
            };

            Assert.That(strToEscape.EscapeText(dico), Is.EqualTo(strEscape));
        }

        [Test]
        public void EscapeText_WithoutEscape()
        {
            string strToEscape  = "NOM+PRENOM_PRENOM-NOM";
            string strEscape    = "NOM+PRENOM_PRENOM-NOM";
            Dictionary<char, string> dico = new Dictionary<char, string>
            {
                { Constants.DEFAULT_SEP_FIELD, Constants.ESCAPE_FIELD },
                { Constants.DEFAULT_SEP_COMPONENT, Constants.ESCAPE_COMPONENT },
                { Constants.DEFAULT_SEP_REPETITION, Constants.ESCAPE_REPETITION },
                { Constants.DEFAULT_ESCAPE_CHARACTER, Constants.ESCAPE_CHAR },
                { Constants.DEFAULT_SEP_SUBCOMPONENT, Constants.ESCAPE_SUBCOMPONENT }
            };

            Assert.That(strToEscape.EscapeText(dico), Is.EqualTo(strEscape));
        }

        [Test]
        public void EscapeText_InvalidSource()
        {
            string str = "  ";
            Assert.Throws<ArgumentException>(
                delegate {
                    str.EscapeText(new Dictionary<char, string>());
                }
            );
        }

        [Test]
        public void EscapeText_InvalidDictionary()
        {
            string str = @"|NOM^PRENOM~PRENOM^NOM&\VAL1|"; ;
            Assert.Throws<ArgumentException>(
                delegate {
                    str.EscapeText(new Dictionary<char, string>());
                }
            );
        }

        [Test]
        public void UnescapeText_Valid()
        {
            string strToUnescape    = @"\F\NOM\S\PRENOM\R\PRENOM\S\NOM\T\\E\VAL1\F\";
            string strUnescape      = @"|NOM^PRENOM~PRENOM^NOM&\VAL1|";
            Dictionary<string, char> dico = new Dictionary<string, char>
            {
                { Constants.ESCAPE_FIELD, Constants.DEFAULT_SEP_FIELD },
                { Constants.ESCAPE_COMPONENT, Constants.DEFAULT_SEP_COMPONENT },
                { Constants.ESCAPE_REPETITION, Constants.DEFAULT_SEP_REPETITION },
                { Constants.ESCAPE_CHAR, Constants.DEFAULT_ESCAPE_CHARACTER },
                { Constants.ESCAPE_SUBCOMPONENT, Constants.DEFAULT_SEP_SUBCOMPONENT }
            };

            Assert.That(strToUnescape.UnescapeText(dico), Is.EqualTo(strUnescape));
        }

        [Test]
        public void UnescapeText_WithoutUnescape()
        {
            string strToUnescape = @"|NOM^PRENOM~PRENOM^NOM&\VAL1|";
            string strUnescape   = @"|NOM^PRENOM~PRENOM^NOM&\VAL1|";
            Dictionary<string, char> dico = new Dictionary<string, char>
            {
                { Constants.ESCAPE_FIELD, Constants.DEFAULT_SEP_FIELD },
                { Constants.ESCAPE_COMPONENT, Constants.DEFAULT_SEP_COMPONENT },
                { Constants.ESCAPE_REPETITION, Constants.DEFAULT_SEP_REPETITION },
                { Constants.ESCAPE_CHAR, Constants.DEFAULT_ESCAPE_CHARACTER },
                { Constants.ESCAPE_SUBCOMPONENT, Constants.DEFAULT_SEP_SUBCOMPONENT }
            };

            Assert.That(strToUnescape.UnescapeText(dico), Is.EqualTo(strUnescape));
        }

        [Test]
        public void UnescapeText_InvalidSource()
        {
            string str = "  ";
            Assert.Throws<ArgumentException>(
                delegate {
                    str.UnescapeText(new Dictionary<string, char>());
                }
            );
        }

        [Test]
        public void UnescapeText_InvalidDictionary()
        {
            string str = @"|NOM^PRENOM~PRENOM^NOM&\VAL1|"; ;
            Assert.Throws<ArgumentException>(
                delegate {
                    str.UnescapeText(new Dictionary<string, char>());
                }
            );
        }
    }
}