namespace Xalise.Interop.HL7.Core
{
    /// <summary>
    /// Représentation d'une partie d'un message HL7 (segment ou groupe).
    /// </summary>
    public interface IStructure
    {
        /// <summary>
        /// Récupère le message auquel appartient la structure.
        /// </summary>
        /// <remarks>
        /// L'affectation de la valeur est réalisée à la construction du message.
        /// </remarks>
        IMessage Message { get; }

        /// <summary>
        /// Récupère le groupe parent auquel appartient la structure.
        /// </summary>
        IGroup ParentStructure { get; }

        /// <summary>
        /// Récupère le nom de la structure.
        /// </summary>
        /// <returns>Nom de la structure.</returns>
        string StructureName { get; }
    }
}
