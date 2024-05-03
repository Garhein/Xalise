using NUnit.Framework;
using System;
using Xalise.Interop.HL7.Helpers;

namespace Xalise.Tests.Interop.HL7.Helpers
{
    public class FieldHelperTests
    {
        [SetUp]
        public void Setup()
        {

        }

        /// <summary>
        /// Le nom du segment est NULL.
        /// </summary>
        [Test]
        public void Invalid_SegmentNameNull()
        {
            Assert.Throws<ArgumentException>(() => FieldHelper.ConstructFieldNumber(null, 1));
        }

        /// <summary>
        /// Le nom du segment est vide.
        /// </summary>
        [Test]
        public void Invalid_SegmentNameEmpty()
        {
            Assert.Throws<ArgumentException>(() => FieldHelper.ConstructFieldNumber(string.Empty, 1));
        }

        /// <summary>
        /// Le nom du segment est composé uniquement d'espaces.
        /// </summary>
        [Test]
        public void Invalid_SegmentNameWhiteSpace()
        {
            Assert.Throws<ArgumentException>(() => FieldHelper.ConstructFieldNumber("   ", 1));
        }

        /// <summary>
        /// Le numéro du champ est inférieur ou égal à 0.
        /// </summary>
        [Test]
        public void Invalid_FieldNumber()
        {
            Assert.Throws<ArgumentException>(() => FieldHelper.ConstructFieldNumber("MSH", -1));
        }

        /// <summary>
        /// Construction uniquement avec le numéro de champ.
        /// </summary>
        [Test]
        public void Valid_FieldNumber()
        {
            string expected = "MSH-1";
            string ret      = FieldHelper.ConstructFieldNumber("MSH", 1);
            Assert.That(ret, Is.EqualTo(expected));
        }

        /// <summary>
        /// Construction avec le numéro de répétition.
        /// </summary>
        [Test]
        public void Valid_RepetitiondNumber()
        {
            string expected = "MSH-1.2";
            string ret      = FieldHelper.ConstructFieldNumber("MSH", 1, 2);
            Assert.That(ret, Is.EqualTo(expected));
        }

        /// <summary>
        /// Construction avec le numéro de sous champ.
        /// </summary>
        [Test]
        public void Valid_SubFieldNumber()
        {
            string expected = "MSH-1.2/3";
            string ret      = FieldHelper.ConstructFieldNumber("MSH", 1, 2, 3);
            Assert.That(ret, Is.EqualTo(expected));
        }
    }
}
