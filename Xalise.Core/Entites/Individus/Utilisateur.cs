using System.ComponentModel.DataAnnotations;

namespace Xalise.Core.Entites.Individus
{
    [Serializable]
    public class Utilisateur
    {
        public int      Id { get; set; }

        [MaxLength(100)]
        public string   Nom { get; set; }
        [MaxLength(100)]
        public string   Prenom { get; set; }

        /// <summary>
        /// Constructeur par défaut.
        /// </summary>
        public Utilisateur()
        {
            this.Id     = 0;
            this.Nom    = string.Empty;
            this.Prenom = string.Empty;
        }
    }
}
