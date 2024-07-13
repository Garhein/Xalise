namespace Xalise.Core.Entites.Technique
{
    [Serializable]
    public class Application
    {
        public int      Id { get; set; }
        public string   Nom { get; set; }

        /// <summary>
        /// Constructeur par défaut.
        /// </summary>
        public Application()
        {
            this.Id     = 0;
            this.Nom    = string.Empty;
        }
    }
}
