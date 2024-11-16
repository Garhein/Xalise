using System;
using Xalise.Interop.HL7.Helpers;

namespace Xalise.Tests
{
    /// <summary>
    /// Tests unitaires liés à <see cref="FieldHelper"/>.
    /// </summary>
    public class FieldHelperTests
    {
        [Test]
        public void ConstructFieldNumber()
        {
            Assert.That(
                FieldHelper.ConstructFieldNumber("MSH", 21, 1, 2),
                Is.EqualTo("MSH-21.1/2")
            );
        }

        [Test]
        public void ConstructFieldNumber_Repetition()
        {
            Assert.That(
                FieldHelper.ConstructFieldNumber("MSH", 21, 1),
                Is.EqualTo("MSH-21.1")
            );
        }

        [Test]
        public void ConstructFieldNumber_Field()
        {
            Assert.That(
                FieldHelper.ConstructFieldNumber("MSH", 21),
                Is.EqualTo("MSH-21")
            );
        }

        [Test]
        public void ConstructFieldNumber_SegmentNameNotValid()
        {
            Assert.Throws<ArgumentException>(delegate { FieldHelper.ConstructFieldNumber("", 21); });
        }

        [Test]
        public void ConstructFieldNumber_FieldNumberNotValid()
        {
            Assert.Throws<ArgumentException>(delegate { FieldHelper.ConstructFieldNumber("MSH", 0); });
        }
    }
}