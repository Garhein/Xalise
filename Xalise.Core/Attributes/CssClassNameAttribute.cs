namespace Xalise.Core.Attributes
{
    /// <summary>
    /// Définition de la ou les classe(s) CSS applicable(s) à un élément.
    /// </summary>
    /// <remarks>
    /// Applicable aux <see cref="AttributeTargets.Field"/>.
    /// </remarks>
    [AttributeUsage(AttributeTargets.Field)]
    public class CssClassNameAttribute : Attribute
    {
        private string _className;

        /// <summary>
        /// Classe(s) CSS applicable(s).
        /// </summary>
        public string ClassName
        {
            get
            {
                return this._className;
            }
        }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="className">La ou les classes CSS applicable(s).</param>
        public CssClassNameAttribute(string className)
        {
            this._className = className;
        }
    }
}