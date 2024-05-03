using Xalise.Interop.Exceptions;

namespace Xalise.Interop.HL7.Core
{
    /// <summary>
    /// Déclaration des fonctionnalités commune à l'ensemble des types de données composites.
    /// </summary>
    /// <remarks>
    /// Un type composite contient plusieurs composants.<br/>
    /// Exemple : CE.
    /// </remarks>
    public interface ITypeComposite
    {
        /// <summary>
        /// Récupère les composants du type de donnée.
        /// </summary>
        IType[] Components { get; }

        /// <summary>
        /// Récupération d'un composant du type de données.
        /// </summary>
        /// <remarks>
        /// Une base 1 est utilisée pour accéder aux composants.
        /// </remarks>
        /// <typeparam name="CType">Type du composant.</typeparam>
        /// <param name="index">Index du composant.</param>
        /// <returns>Composant de type <typeparamref name="CType"/></returns>
        /// <exception cref="HL7Exception">Si <paramref name="index"/> est inférieur ou égal à 0 où que le composant n'existe pas pour l'index spécifié.</exception>
        CType GetComponent<CType>(int index) where CType : class, IType;

        /// <summary>
        /// Affectation d'un composant du type de données.
        /// </summary>
        /// <remarks>
        /// Une base 1 est utilisée pour accéder aux composants.
        /// </remarks>
        /// <typeparam name="CType">Type du composant.</typeparam>
        /// <param name="index">Index du composant.</param>
        /// <param name="component">Composant à affecter.</param>
        /// <exception cref="HL7Exception">Si <paramref name="index"/> est inférieur ou égal à 0 où que le composant n'existe pas pour l'index spécifié.</exception>
        void SetComponent<CType>(int index, CType component) where CType : class, IType;
    }
}
