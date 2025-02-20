namespace Xalise.Interop.HL7.Core
{
    /// <summary>
    /// Fonctionnalités des éléments composant un message HL7, que ce soit un groupe ou un segment.
    /// </summary>
    /// <author>Xavier VILLEMIN - xavier.villemin@gmail.com</author>
    public interface IStructure
    {
        /// <summary>
        /// Nom de la structure.
        /// </summary>
        string StructureName { get; }
    }
}