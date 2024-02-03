using System;
using Xalise.Interop.HL7.Enums;
using Xalise.Interop.HL7.Exceptions;

namespace Xalise.Interop.HL7.Core
{
    /// <summary>
    /// Représentation d'un type de donnée composite.
    /// </summary>
    [Serializable]
    public abstract class AbstractTypeComposite : AbstractType, ITypeComposite
    {
        private IType[] _components;

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        /// <param name="nbComponents">Nombre de composant du type de donnée.</param>
        public AbstractTypeComposite(int nbComponents, string description, int maxLength, EnumDataUsage usage) : this(nbComponents, description, maxLength, usage, 0) { }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="nbComponents">Nombre de composant du type de donnée.</param>
        /// <param name="description">Description du type de la donnée.</param>
        /// <param name="maxLength">Longueur maximale autorisée.</param>
        /// <param name="usage">Condition d'usage de la donnée.</param>
        /// <param name="codeTable">Code de la table de donnée associée</param>
        public AbstractTypeComposite(int nbComponents, string description, int maxLength, EnumDataUsage usage, int codeTable) : base(description, maxLength, usage, codeTable)
        {
            if (nbComponents <= 0)
            {
                throw new InteropHL7Exception($"Le nombre de composant du type '{this.TypeName}' n'est pas valide.");
            }

            this._components = new IType[nbComponents];
        }

        /// <inheritdoc/>
        public IType[] Components
        { 
            get
            {
                return this._components;
            }
        }

        /// <inheritdoc/>
        public IType this[int index]
        {
            get
            {
                try
                {
                    if (index < 1)
                    {
                        throw new InteropHL7Exception($"L'accès à un composant du type '{this.TypeName}' doit être réalisé à partir de l'index 1 (index utilisé : {index}).");
                    }
                    else
                    {
                        return this._components[index - 1];
                    }
                }
                catch (ArgumentOutOfRangeException ex)
                {
                    throw new InteropHL7Exception($"Le composant à la position {index - 1} n'existe pas pour le type '{this.TypeName}'.", ex);
                }
            }
            set
            {
                try
                {
                    if (index < 1)
                    {
                        throw new InteropHL7Exception($"L'accès à un composant du type '{this.TypeName}' doit être réalisé à partir de l'index 1 (index utilisé : {index}).");
                    }
                    else
                    {
                        this._components[index - 1] = value;
                    }
                }
                catch (ArgumentOutOfRangeException ex)
                {
                    throw new InteropHL7Exception($"Le composant à la position {index - 1} n'existe pas pour le type '{this.TypeName}'.", ex);
                }
            }
        }
    }
}
