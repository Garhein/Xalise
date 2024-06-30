using Xalise.Interop.HL7.Enums;

namespace Xalise.Interop.HL7.Core
{
    /// <summary>
    /// Représentation un segment d'un message HL7, qui est une unité de données contenant plusieurs champs.
    /// </summary>
    public interface ISegment : IStructure
    {
        FieldType[] GetField<FieldType>(int fieldNumber);

        FieldType GetField<FieldType>(int fieldNumber, int repNumber);

        string GetFieldDescription(int fieldNumber);

        int GetFieldMaxLength(int fieldNumber);

        EnumDataUsage GetFieldUsage(int fieldNumber);

        int GetFieldMaxRepetitions(int fieldNumber);

        int GetFieldCodeTable(int fieldNumber);

        int GetTotalFieldRepetitions(int fieldNumber);

        void RemoveRepetition(int fieldNumber, int repNumber);

        void RemoveRepetition(int fieldNumber, IType repToRemove);

        int NumFields { get; }
    }
}
