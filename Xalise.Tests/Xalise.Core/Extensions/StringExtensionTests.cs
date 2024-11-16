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
    }
}