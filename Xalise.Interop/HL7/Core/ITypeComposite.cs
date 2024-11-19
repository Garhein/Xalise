using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Structure.DataType.Composite;

namespace Xalise.Interop.HL7.Core
{
    /// <summary>
    /// Fonctionnalités des types de données composites.
    /// </summary>
    /// <remarks>
    /// Un type composite contient plusieurs composants.<br/>
    /// Exemple : <see cref="EI"/> EI ou <see cref="MSG"/>.
    /// </remarks>
    /// <author>Xavier VILLEMIN - xavier.villemin@gmail.com</author>
    public interface ITypeComposite
    {
        /// <summary>
        /// Composants du type de données.
        /// </summary>
        IType[] Components { get; }

        /// <summary>
        /// Récupère un composant du type de données.
        /// </summary>
        /// <remarks>
        /// L'accès aux composants est réalisé à partir de l'index 1.
        /// </remarks>
        /// <typeparam name="CType">Type du composant.</typeparam>
        /// <param name="index">Index du composant.</param>
        /// <returns>Un composant de type <typeparamref name="CType"/>.</returns>
        /// <exception cref="HL7Exception">Si <paramref name="index"/> est inférieur ou égal à 0 où que le composant n'existe pas pour l'index spécifié.</exception>
        CType GetComponent<CType>(int index) where CType : class, IType;

        /// <summary>
        /// Affecte une valeur à un composant du type de données.
        /// </summary>
        /// <remarks>
        /// L'accès aux composants est réalisé à partir de l'index 1.
        /// </remarks>
        /// <typeparam name="CType">Type du composant.</typeparam>
        /// <param name="index">Index du composant.</param>
        /// <param name="component">Valeur à affecter au composant.</param>
        /// <exception cref="HL7Exception">Si <paramref name="index"/> est inférieur ou égal à 0 où que le composant n'existe pas pour l'index spécifié.</exception>
        void SetComponent<CType>(int index, CType component) where CType : class, IType;
    }
}
