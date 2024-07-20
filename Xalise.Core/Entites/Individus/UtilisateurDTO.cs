using System.ComponentModel.DataAnnotations;

namespace Xalise.Core.Entites.Individus
{
    [Serializable]
    public class UtilisateurDTO
    {
        public int      Id { get; set; }

        [MaxLength(100)]
        public string   Nom { get; set; }
        [MaxLength(100)]
        public string   Prenom { get; set; }

        /// <summary>
        /// Constructeur par défaut.
        /// </summary>
        public UtilisateurDTO()
        {
            this.Id     = 0;
            this.Nom    = string.Empty;
            this.Prenom = string.Empty;
        }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="utilisateur">Utilisateur à partir duquel instancier le DTO.</param>
        public UtilisateurDTO(Utilisateur utilisateur) : this()
        {
            if (utilisateur != null)
            {
                this.Id     = utilisateur.Id;
                this.Nom    = utilisateur.Nom;
                this.Prenom = utilisateur.Prenom;
            }
        }
    }
}
