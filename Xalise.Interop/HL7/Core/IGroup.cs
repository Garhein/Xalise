using System;
using Xalise.Interop.HL7.Enums;

namespace Xalise.Interop.HL7.Core
{
    /// <summary>
    /// Représentation d'une partie d'un message pouvant être répétée.
    /// </summary>
    public interface IGroup : IStructure
    {
        /// <summary>
        /// Récupère un tableau ordonné du nom des structures de ce groupe.
        /// </summary>
        string[] Names { get; }

        IStructure[] GetAll(string name);

        IStructure GetStructure(string name);

        IStructure GetStructure(string name, int repetition);

        EnumDataUsage GetUsage(string name);

        bool IsRepeating(string name);

        bool IsChoiceElement(string name);

        bool IsGroup(string name);

        Type GetType(string name);
    }
}
