using NUnit.Framework;
using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Enums;

namespace Xalise.Tests.Interop.HL7.Structure
{
    public class DataTypeCompositeTests
    {
        [SetUp]
        public void Setup()
        {

        }

        /// <summary>
        /// Nombre de composants non valide.
        /// </summary>
        [Test]
        public void Invalid_NumberOfComponents()
        {
            Assert.Throws<HL7Exception>(() => new InvalidDataTypeComposite("Invalid data type composite", 50, EnumDataUsage.REQUIRED));
        }
    }

    public class InvalidDataTypeComposite : AbstractTypeComposite
    {
        /// <inheritdoc/>
        public InvalidDataTypeComposite(string description, int maxLength, EnumDataUsage usage) : this(description, maxLength, usage, 0) { }

        /// <inheritdoc/>
        public InvalidDataTypeComposite(string description, int maxLength, EnumDataUsage usage, int codeTable) : base(0, description, maxLength, usage, codeTable) { }
    }
}
