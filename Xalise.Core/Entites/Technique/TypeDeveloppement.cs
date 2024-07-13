namespace Xalise.Core.Entites.Technique
{
    [Serializable]
    public class TypeDeveloppement
    {
        public int      Id { get; set; }
        public string   Nom { get; set; }

        /// <summary>
        /// Constructeur par défaut.
        /// </summary>
        public TypeDeveloppement()
        {
            this.Id     = 0;
            this.Nom    = string.Empty;
        }
    }
}
