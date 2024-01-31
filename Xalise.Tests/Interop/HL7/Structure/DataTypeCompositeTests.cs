using NUnit.Framework;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Structure.DataType.Composite;
using Xalise.Interop.HL7.Structure.Table;

namespace Xalise.Tests.Interop.HL7.Structure
{
    public class DataTypeCompositeTests
    {
        [Test]
        public void TypeCE()
        {
            CE obj = new CE("CE Test", 50, EnumDataUsage.OPTIONAL, TableDefinition.T0200_NAME_TYPE);
            Assert.IsTrue(obj != null);
        }

        [Test]
        public void TypeCWE()
        {
            CWE obj = new CWE("CWE Test", 50, EnumDataUsage.OPTIONAL);
            Assert.IsTrue(obj != null);
        }

        [Test]
        public void TypeCX()
        {
            CX obj = new CX("CX Test", 50, EnumDataUsage.OPTIONAL);
            Assert.IsTrue(obj != null);
        }

        [Test]
        public void TypeDLN()
        {
            DLN obj = new DLN("DLN Test", 50, EnumDataUsage.OPTIONAL);
            Assert.IsTrue(obj != null);
        }

        [Test]
        public void TypeDR()
        {
            DR obj = new DR("DR Test", 50, EnumDataUsage.OPTIONAL);
            Assert.IsTrue(obj != null);
        }

        [Test]
        public void TypeEI()
        {
            EI obj = new EI("EI Test", 50, EnumDataUsage.OPTIONAL);
            Assert.IsTrue(obj != null);
        }

        [Test]
        public void TypeFN()
        {
            FN obj = new FN("FN Test", 50, EnumDataUsage.OPTIONAL);
            Assert.IsTrue(obj != null);
        }

        [Test]
        public void TypeHD()
        {
            HD obj = new HD("HD Test", 50, EnumDataUsage.OPTIONAL);
            Assert.IsTrue(obj != null);
        }

        [Test]
        public void TypeMSG()
        {
            MSG obj = new MSG("MSG Test", 50, EnumDataUsage.OPTIONAL);
            Assert.IsTrue(obj != null);
        }

        [Test]
        public void TypePT()
        {
            PT obj = new PT("PT Test", 50, EnumDataUsage.OPTIONAL);
            Assert.IsTrue(obj != null);
        }

        [Test]
        public void TypeSAD()
        {
            SAD obj = new SAD("SAD Test", 50, EnumDataUsage.OPTIONAL);
            Assert.IsTrue(obj != null);
        }

        [Test]
        public void TypeTS()
        {
            TS obj = new TS("TS Test", 50, EnumDataUsage.OPTIONAL);
            Assert.IsTrue(obj != null);
        }

        [Test]
        public void TypeVID()
        {
            VID obj = new VID("VID Test", 50, EnumDataUsage.OPTIONAL);
            Assert.IsTrue(obj != null);
        }

        [Test]
        public void TypeXAD()
        {
            XAD obj = new XAD("XAD Test", 50, EnumDataUsage.OPTIONAL);
            Assert.IsTrue(obj != null);
        }

        [Test]
        public void TypeXCN()
        {
            XCN obj = new XCN("XCN Test", 50, EnumDataUsage.OPTIONAL);
            Assert.IsTrue(obj != null);
        }

        [Test]
        public void TypeXON()
        {
            XON obj = new XON("XON Test", 50, EnumDataUsage.OPTIONAL);
            Assert.IsTrue(obj != null);
        }

        [Test]
        public void TypeXPN()
        {
            XPN obj = new XPN("XPN Test", 50, EnumDataUsage.OPTIONAL);
            Assert.IsTrue(obj != null);
        }

        [Test]
        public void TypeXTN()
        {
            XTN obj = new XTN("XTN Test", 50, EnumDataUsage.OPTIONAL);
            Assert.IsTrue(obj != null);
        }
    }
}
