using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Enums;

namespace Xalise.Interop.HL7.Core
{
    /// <summary>
    /// Type de données composite.
    /// </summary>
    /// <author>Xavier VILLEMIN - xavier.villemin@gmail.com</author>
    [Serializable]
    public abstract class AbstractTypeComposite : AbstractType, ITypeComposite
    {
        private IType[] _components;

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="nbComponents">Nombre de composant du type de données.</param>
        /// <param name="description">Description de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        public AbstractTypeComposite(int nbComponents, string description, int maxLength, EnumDataUsage usage) : this(nbComponents, description, maxLength, usage, 0) { }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="nbComponents">Nombre de composant du type de données.</param>
        /// <param name="description">Description de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        /// <param name="codeTable">Code de la table de données associée</param>
        public AbstractTypeComposite(int nbComponents, string description, int maxLength, EnumDataUsage usage, int codeTable) : base(description, maxLength, usage, codeTable)
        {
            if (nbComponents <= 0)
            {
                throw new HL7Exception($"Le nombre de composant du type '{this.TypeName}' n'est pas valide.");
            }

            this._components = new IType[nbComponents];
        }

        /// <inheritdoc/>
        public IType[] Components => this._components;

        /// <inheritdoc/>
        public CType GetComponent<CType>(int index) where CType : class, IType
        {
            try
            {
                if (index < 1)
                {
                    throw new HL7Exception($"L'accès à un composant du type de donnée '{this.TypeName}' doit être réalisé à partir de l'index 1 (index utilisé : {index}).");
                }
                else
                {
                    return (CType)this._components[index - 1];
                }
            }
            catch (ArgumentOutOfRangeException ex)
            {
                throw new HL7Exception($"Le composant à la position {index} n'existe pas pour le type de donnée '{this.TypeName}'.", ex);
            }
        }

        /// <inheritdoc/>
        public void SetComponent<CType>(int index, CType component) where CType : class, IType
        {
            try
            {
                if (index < 1)
                {
                    throw new HL7Exception($"L'accès à un composant du type de donnée '{this.TypeName}' doit être réalisé à partir de l'index 1 (index utilisé : {index}).");
                }
                else
                {
                    this._components[index - 1] = component;
                }
            }
            catch (ArgumentOutOfRangeException ex)
            {
                throw new HL7Exception($"Le composant à la position {index} n'existe pas pour le type de donnée '{this.TypeName}'.", ex);
            }
        }
    }
}
