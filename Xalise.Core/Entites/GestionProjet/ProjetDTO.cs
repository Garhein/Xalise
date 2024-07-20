using System.ComponentModel.DataAnnotations;
using Xalise.Core.Entites.Individus;
using Xalise.Core.Entites.Technique;

namespace Xalise.Core.Entites.GestionProjet
{
    [Serializable]
    public class ProjetDTO
    {
        public int                  Id {  get; set; }
        
        [Required]
        [MaxLength(100)]
        public string               Intitule { get; set; }
        public string               Description { get; set; }
        public decimal              PourcentageRealisation { get; set; }
        public decimal              TempsEstime { get; set; }
        public decimal              TempsReel { get; set; }
        public decimal              PourcentageEcart { get; set; }
        public List<UtilisateurDTO> ListeRespProjet { get; set; }
        public ClientDTO            Client { get; set; }
        public ApplicationDTO       Application { get; set; }
        public TypeDeveloppementDTO TypeDeveloppement { get; set; }
        public bool                 EstAnnule { get; set; }

        /// <summary>
        /// Constructeur par défaut.
        /// </summary>
        public ProjetDTO()
        {
            this.Id                     = 0;
            this.Intitule               = string.Empty;
            this.Description            = string.Empty;
            this.PourcentageRealisation = 0;
            this.TempsEstime            = 0;
            this.TempsReel              = 0;
            this.PourcentageEcart       = 0;
            this.ListeRespProjet        = new List<UtilisateurDTO>();
            this.Client                 = new ClientDTO();
            this.Application            = new ApplicationDTO();
            this.TypeDeveloppement      = new TypeDeveloppementDTO();
            this.EstAnnule              = false;
        }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="projet">Projet à partir duquel instancier le DTO.</param>
        public ProjetDTO(Projet projet) : this()
        {
            if (projet != null)
            {
                this.Id                     = projet.Id;
                this.Intitule               = projet.Intitule;
                this.Description            = projet.Description;
                this.PourcentageRealisation = projet.PourcentageRealisation;
                this.TempsEstime            = projet.TempsEstime;
                this.TempsReel              = projet.TempsReel;
                this.PourcentageEcart       = projet.PourcentageEcart;
                this.EstAnnule              = projet.EstAnnule;
            }
        }
    }
}
