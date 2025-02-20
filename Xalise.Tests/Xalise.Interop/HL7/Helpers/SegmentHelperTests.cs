using System;
using Xalise.Interop.HL7.Helpers;

namespace Xalise.Tests
{
    /// <summary>
    /// Tests unitaires liés à <see cref="SegmentHelper"/>.
    /// </summary>
    public class SegmentHelperTests
    {
        [Test]
        public void IsSegmentDefDelimiters_InvalidSegmentName()
        {
            string segmentName = "  ";

            Assert.Throws<ArgumentException>(
                delegate {
                    SegmentHelper.IsSegmentDefDelimiters(segmentName);
                }
            );
        }

        [Test]
        public void IsSegmentDefDelimiters_Valid()
        {
            string segmentName = "MSH";
            Assert.That(SegmentHelper.IsSegmentDefDelimiters(segmentName),Is.True);
        }

        [Test]
        public void IsSegmentDefDelimiters_Invalid()
        {
            string segmentName = "PID";
            Assert.That(SegmentHelper.IsSegmentDefDelimiters(segmentName), Is.False);
        }
    }
}