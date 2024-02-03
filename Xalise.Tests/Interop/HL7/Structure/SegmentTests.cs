using NUnit.Framework;
using Xalise.Interop.HL7.Exceptions;
using Xalise.Interop.HL7.Structure.DataType.Composite;
using Xalise.Interop.HL7.Structure.Segment;

namespace Xalise.Tests.Interop.HL7.Structure
{
    public class SegmentTest
    {
        [Test]
        public void InitSegmentWithoutException()
        {
            Assert.DoesNotThrow(() => { MSH segMSH = new MSH(); });
        }

        [Test]
        public void SetFieldNotRepeatable()
        {
            Assert.DoesNotThrow(() =>
            {
                MSH segMSH = new MSH();
                segMSH.FieldSeparator.Value = "|";
            });
        }

        [Test]
        public void GetFieldNotRepeatable()
        {
            MSH segMSH = new MSH();
            segMSH.FieldSeparator.Value = "|";
            Assert.That(segMSH.FieldSeparator.Value, Is.EqualTo("|"));
        }

        [Test]
        public void SetFieldRepeatable()
        {
            Assert.DoesNotThrow(() =>
            {
                MSH segMSH = new MSH();
                segMSH.GetMessageProfileIdentifier(1).NamespaceId.Value = "A";
                segMSH.GetMessageProfileIdentifier(2).NamespaceId.Value = "B";
                segMSH.GetMessageProfileIdentifier(3).NamespaceId.Value = "C";
            });
        }

        [Test]
        public void GetFieldRepeatable()
        {
            MSH segMSH = new MSH();
            segMSH.GetMessageProfileIdentifier(1).NamespaceId.Value = "A";
            segMSH.GetMessageProfileIdentifier(2).NamespaceId.Value = "B";
            segMSH.GetMessageProfileIdentifier(3).NamespaceId.Value = "C";

            string retVal = string.Empty;
            retVal = $"{retVal}{segMSH.GetMessageProfileIdentifier(1).NamespaceId.Value}";
            retVal = $"{retVal}{segMSH.GetMessageProfileIdentifier(2).NamespaceId.Value}";
            retVal = $"{retVal}{segMSH.GetMessageProfileIdentifier(3).NamespaceId.Value}";

            Assert.That(retVal, Is.EqualTo("ABC"));
        }

        [Test]
        public void GetRepetitions()
        {
            MSH segMSH = new MSH();
            segMSH.GetMessageProfileIdentifier(1).NamespaceId.Value = "A";
            segMSH.GetMessageProfileIdentifier(2).NamespaceId.Value = "B";
            segMSH.GetMessageProfileIdentifier(3).NamespaceId.Value = "C";

            EI[] ret = segMSH.GetMessageProfileIdentifier();
            Assert.That(ret.Length, Is.EqualTo(3));
        }

        [Test]
        public void GetFieldRepeatableNotValid()
        {
            MSH segMSH = new MSH();
            segMSH.GetMessageProfileIdentifier(1).NamespaceId.Value = "A";
            segMSH.GetMessageProfileIdentifier(2).NamespaceId.Value = "B";
            segMSH.GetMessageProfileIdentifier(3).NamespaceId.Value = "C";
            Assert.Throws<InteropHL7Exception>(() => segMSH.GetMessageProfileIdentifier(-1));
        }

        [Test]
        public void CountFieldRepetitions()
        {
            MSH segMSH = new MSH();
            segMSH.GetMessageProfileIdentifier(1).NamespaceId.Value = "A";
            segMSH.GetMessageProfileIdentifier(2).NamespaceId.Value = "B";
            segMSH.GetMessageProfileIdentifier(3).NamespaceId.Value = "C";
            segMSH.GetMessageProfileIdentifier(4).NamespaceId.Value = "D";
            segMSH.GetMessageProfileIdentifier(5).NamespaceId.Value = "E";

            Assert.That(segMSH.MessageProfileIdentifierTotalRepetitions, Is.EqualTo(5));
        }
    }
}
