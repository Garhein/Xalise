using NUnit.Framework;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Structure.DataType.Primitive;

namespace Xalise.Tests.Interop.HL7.Structure
{
    public class DataTypePrimitiveTests
    {
        [SetUp]
        public void Setup()
        {

        }

        [Test]
        public void TypeDT()
        {
            DT objDT    = new DT("DT Test", 50, EnumDataUsage.OPTIONAL);
            objDT.Value = "DT_value";

            Assert.IsTrue(objDT != null && objDT.Value == "DT_value");
        }

        [Test]
        public void TypeDTM()
        {
            DTM objDTM   = new DTM("DTM Test", 50, EnumDataUsage.OPTIONAL);
            objDTM.Value = "DTM_value";

            Assert.IsTrue(objDTM != null && objDTM.Value == "DTM_value");
        }

        [Test]
        public void TypeID()
        {
            ID objID    = new ID("ID Test", 50, EnumDataUsage.OPTIONAL);
            objID.Value = "ID_value";

            Assert.IsTrue(objID != null && objID.Value == "ID_value");
        }

        [Test]
        public void TypeIS()
        {
            IS objIS    = new IS("IS Test", 50, EnumDataUsage.OPTIONAL);
            objIS.Value = "IS_value";

            Assert.IsTrue(objIS != null && objIS.Value == "IS_value");
        }

        [Test]
        public void TypeNM()
        {
            NM objNM    = new NM("NM Test", 50, EnumDataUsage.OPTIONAL);
            objNM.Value = "NM_value";

            Assert.IsTrue(objNM != null && objNM.Value == "NM_value");
        }

        [Test]
        public void TypeSI()
        {
            SI objSI    = new SI("SI Test", 50, EnumDataUsage.OPTIONAL);
            objSI.Value = "SI_value";

            Assert.IsTrue(objSI != null && objSI.Value == "SI_value");
        }

        [Test]
        public void TypeST()
        {
            ST objST    = new ST("ST Test", 50, EnumDataUsage.OPTIONAL);
            objST.Value = "ST_value";

            Assert.IsTrue(objST != null && objST.Value == "ST_value");
        }

        [Test]
        public void TypeTX()
        {
            TX objTX    = new TX("TX Test", 50, EnumDataUsage.OPTIONAL);
            objTX.Value = "TX_value";

            Assert.IsTrue(objTX != null && objTX.Value == "TX_value");
        }
    }
}
