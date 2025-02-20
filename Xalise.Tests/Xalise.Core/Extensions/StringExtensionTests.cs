using System;
using System.Collections.Generic;
using Xalise.Core.Extensions;
using Xalise.Interop.HL7.Core;

namespace Xalise.Tests
{
    public class StringExtensionTests
    {
        private Dictionary<char, string> _dicoEscapeText;
        private Dictionary<string, char> _dicoUnescapeText;

        [SetUp]
        public void InitData()
        {
            // TODO: remplacer un 'helper' interne -> CreateDicoEscapeText (sans utilisation des constantes pour éviter un couplage)

            this._dicoEscapeText = new Dictionary<char, string>
            {
                { Constants.DEFAULT_SEP_FIELD, Constants.ESCAPE_FIELD },
                { Constants.DEFAULT_SEP_COMPONENT, Constants.ESCAPE_COMPONENT },
                { Constants.DEFAULT_SEP_REPETITION, Constants.ESCAPE_REPETITION },
                { Constants.DEFAULT_ESCAPE_CHARACTER, Constants.ESCAPE_CHAR },
                { Constants.DEFAULT_SEP_SUBCOMPONENT, Constants.ESCAPE_SUBCOMPONENT }
            };

            this._dicoUnescapeText = new Dictionary<string, char>
            {
                { Constants.ESCAPE_FIELD, Constants.DEFAULT_SEP_FIELD },
                { Constants.ESCAPE_COMPONENT, Constants.DEFAULT_SEP_COMPONENT },
                { Constants.ESCAPE_REPETITION, Constants.DEFAULT_SEP_REPETITION },
                { Constants.ESCAPE_CHAR, Constants.DEFAULT_ESCAPE_CHARACTER },
                { Constants.ESCAPE_SUBCOMPONENT, Constants.DEFAULT_SEP_SUBCOMPONENT }
            };
        }

        #region IsNullOrEmpty / IsNotNullOrEmpty / public void IsNullOrWhiteSpace / public void IsNotNullOrWhiteSpace

        [Test]
        [TestCase(null, true)]
        [TestCase("", true)]
        public void IsNullOrEmpty_WhenNullOrEmpty_ReturnsTrue(string? valueToTest, bool expected)
        {
            bool actual = valueToTest.IsNullOrEmpty();
            Assert.That(actual, Is.EqualTo(expected));
        }

        [Test]
        [TestCase("valeur", false)]
        [TestCase("valeur avec espaces", false)]
        public void IsNullOrEmpty_WhenNotNullAndNotEmpty_ReturnsFalse(string valueToTest, bool expected)
        {
            bool actual = valueToTest.IsNullOrEmpty();
            Assert.That(actual, Is.EqualTo(expected));
        }

        [Test]
        [TestCase(null, false)]
        [TestCase("", false)]
        public void IsNotNullOrEmpty_WhenNullOrEmpty_ReturnsFalse(string? valueToTest, bool expected)
        {
            bool actual = valueToTest.IsNotNullOrEmpty();
            Assert.That(actual, Is.EqualTo(expected));
        }

        [Test]
        [TestCase("valeur", true)]
        [TestCase("valeur avec espaces", true)]
        public void IsNotNullOrEmpty_WhenNotNullAndNotEmpty_ReturnsTrue(string valueToTest, bool expected)
        {
            bool actual = valueToTest.IsNotNullOrEmpty();
            Assert.That(actual, Is.EqualTo(expected));
        }

        [Test]
        [TestCase(null, true)]
        [TestCase("  ", true)]
        [TestCase("", true)]
        public void IsNullOrWhiteSpace_WhenNullOrEmptyOrWhiteSpace_ReturnsTrue(string? valueToTest, bool expected)
        {
            bool actual = valueToTest.IsNullOrWhiteSpace();
            Assert.That(actual, Is.EqualTo(expected));
        }

        [Test]
        [TestCase("valeur", false)]
        [TestCase("valeur avec espaces", false)]
        public void IsNullOrWhiteSpace_WhenNotNullOrEmptyOrWhiteSpace_ReturnsFalse(string valueToTest, bool expected)
        {
            bool actual = valueToTest.IsNullOrWhiteSpace();
            Assert.That(actual, Is.EqualTo(expected));
        }

        [Test]
        [TestCase(null, false)]
        [TestCase("  ", false)]
        [TestCase("", false)]
        public void IsNotNullOrWhiteSpace_WhenNullOrEmptyOrWhiteSpace_ReturnsFalse(string? valueToTest, bool expected)
        {
            bool actual = valueToTest.IsNotNullOrWhiteSpace();
            Assert.That(actual, Is.EqualTo(expected));
        }

        [Test]
        [TestCase("valeur", true)]
        [TestCase("valeur avec espaces", true)]
        public void IsNotNullOrWhiteSpace_WhenNotNullOrEmptyOrWhiteSpace_ReturnsTrue(string valueToTest, bool expected)
        {
            bool actual = valueToTest.IsNotNullOrWhiteSpace();
            Assert.That(actual, Is.EqualTo(expected));
        }

        #endregion

        #region Truncate

        [Test]
        [TestCase("valeur", 3, true, "val")]
        [TestCase("valeur", 3, false, "eur")]
        public void Truncate_WithTooLongValue_ReturnsTruncatedValue(string valueToTruncate, int maxLength, bool startFromLeft, string expected)
        {
            string actual = valueToTruncate.Truncate(maxLength, startFromLeft);
            Assert.That(actual, Is.EqualTo(expected));
        }

        [Test]
        [TestCase("valeur", 10, true, "valeur")]
        [TestCase("valeur", 10, false, "valeur")]
        public void Truncate_WithTooShortValue_ReturnsOriginalValue(string valueToTruncate, int maxLength, bool startFromLeft, string expected)
        {
            string actual = valueToTruncate.Truncate(maxLength, startFromLeft);
            Assert.That(actual, Is.EqualTo(expected));
        }

        [Test]
        [TestCase("valeur", -1, true, typeof(ArgumentException))]
        [TestCase("valeur", 0, true, typeof(ArgumentException))]
        public void Truncate_WithInvalidLength_ThrowsArgumentException(string valueToTruncate, int maxLength, bool startFromLeft, Type expected)
        {
            Assert.Throws(expected, () => valueToTruncate.Truncate(maxLength, startFromLeft));
        }

        #endregion








        #region CharsAreUnique

        [Test]
        [TestCase("value", true)]
        [TestCase("|^~&\\", true)]
        [TestCase("valuee", false)]
        [TestCase("abcabc", false)]
        public void CharsAreUnique_WithValidSource(string valueToTest, bool expected)
        {
            bool actual = valueToTest.CharsAreUnique();
            Assert.That(actual, Is.EqualTo(expected));
        }

        [Test]
        [TestCase(null, typeof(ArgumentException))]
        [TestCase("", typeof(ArgumentException))]
        [TestCase("  ", typeof(ArgumentException))]
        public void CharsAreUnique_WithInvalidSource_ThrowsArgumentException(string? valueToTest, Type expectedException)
        {
            Assert.Throws(expectedException, () => valueToTest.CharsAreUnique());
        }

        #endregion

        #region RemoveIdenticalSuccessiveChars

        [Test]
        [TestCase("3|2|1|||||", '|', false, "3|2|1")]
        [TestCase("3|2|1|", '|', false, "3|2|1")]
        [TestCase("|||||1|2|3", '|', true, "1|2|3")]
        [TestCase("|1|2|3", '|', true, "1|2|3")]
        [TestCase("3|2|1", '|', false, "3|2|1")]
        [TestCase("3|2|1", '|', true, "3|2|1")]
        public void RemoveIdenticalSuccessiveChars_WithValidSource(string value, char charToRemove, bool startFromLeft, string expectedValue) 
        {
            string actual = value.RemoveIdenticalSuccessiveChars(charToRemove, startFromLeft);
            Assert.That(actual, Is.EqualTo(expectedValue));
        }

        [Test]
        [TestCase(null, '|', typeof(ArgumentException))]
        [TestCase("", '|', typeof(ArgumentException))]
        [TestCase("  ", '|', typeof(ArgumentException))]
        public void RemoveIdenticalSuccessiveChars_ThrowsArgumentException(string? value, char charToRemove, Type expectedException)
        {
            Assert.Throws(expectedException, () => value.RemoveIdenticalSuccessiveChars(charToRemove));
        }

        #endregion

        #region EscapeText / UnescapeText

        [Test]
        [TestCase(@"|NOM^PRENOM~PRENOM^NOM&\VAL1|", @"\F\NOM\S\PRENOM\R\PRENOM\S\NOM\T\\E\VAL1\F\")]
        [TestCase("NOM+PRENOM_PRENOM-NOM", "NOM+PRENOM_PRENOM-NOM")]
        public void EscapeText_WithValidSource(string value, string expectedValue)
        {
            string actual = value.EscapeText(this._dicoEscapeText);
            Assert.That(actual, Is.EqualTo(expectedValue));
        }

        [Test]
        [TestCase(null, typeof(ArgumentException))]
        [TestCase("", typeof(ArgumentException))]
        [TestCase("  ", typeof(ArgumentException))]
        public void EscapeText_WithInvalidSource_ThrowsArgumentException(string? value, Type expectedException)
        {
            Assert.Throws(expectedException, () => value.EscapeText(new Dictionary<char, string>()));
        }

        [Test]
        [TestCase("valeur", typeof(ArgumentException))]
        public void EscapeText_WithInvalidDico_ThrowsArgumentException(string value, Type expectedException)
        {
            Assert.Throws(expectedException, () => value.EscapeText(new Dictionary<char, string>()));
        }

        [Test]
        [TestCase(@"\F\NOM\S\PRENOM\R\PRENOM\S\NOM\T\\E\VAL1\F\", @"|NOM^PRENOM~PRENOM^NOM&\VAL1|")]
        [TestCase(@"|NOM^PRENOM~PRENOM^NOM&\VAL1|", @"|NOM^PRENOM~PRENOM^NOM&\VAL1|")]
        public void UnescapeText_WithValidSource(string value, string expectedValue)
        {
            string actual = value.UnescapeText(this._dicoUnescapeText);
            Assert.That(actual, Is.EqualTo(expectedValue));
        }

        [Test]
        [TestCase(null, typeof(ArgumentException))]
        [TestCase("", typeof(ArgumentException))]
        [TestCase("  ", typeof(ArgumentException))]
        public void UnescapeText_WithInvalidSource_ThrowsArgumentException(string? value, Type expectedException)
        {
            Assert.Throws(expectedException, () => value.UnescapeText(new Dictionary<string, char>()));
        }

        [Test]
        [TestCase("valeur", typeof(ArgumentException))]
        public void UnescapeText_WithInvalidDico_ThrowsArgumentException(string value, Type expectedException)
        {
            Assert.Throws(expectedException, () => value.UnescapeText(new Dictionary<string, char>()));
        }

        #endregion
    }
}