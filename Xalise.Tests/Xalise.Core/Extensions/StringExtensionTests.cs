using System;
using Xalise.Core.Extensions;

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
    }
}