using System.Collections.Generic;
using Xalise.Core.Extensions;

namespace Xalise.Tests
{
    public class EnumerableExtensionTests
    {
        [Test]
        public void IsEmpty_Null()
        {
            List<int> liste = null;
            Assert.That(liste.IsEmpty(), Is.True);
        }

        [Test]
        public void IsEmpty_Empty()
        {
            List<int> liste = new List<int>();
            Assert.That(liste.IsEmpty(), Is.True);
        }

        [Test]
        public void IsEmpty_WithValues()
        {
            List<int> liste = new List<int> { 1, 2, 3, 4, 5 };
            Assert.That(liste.IsEmpty(), Is.False);
        }

        [Test]
        public void IsNotEmpty_Null()
        {
            List<int> liste = null;
            Assert.That(liste.IsNotEmpty(), Is.False);
        }

        [Test]
        public void IsNotEmpty_Empty()
        {
            List<int> liste = new List<int>();
            Assert.That(liste.IsNotEmpty(), Is.False);
        }

        [Test]
        public void IsNotEmpty_WithValues()
        {
            List<int> liste = new List<int> { 1, 2, 3, 4, 5 };
            Assert.That(liste.IsNotEmpty(), Is.True);
        }
    }
}