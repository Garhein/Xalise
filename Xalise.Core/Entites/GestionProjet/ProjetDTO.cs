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
        public List<Utilisateur>    ListeRespProjet { get; set; }
        public Client               Client { get; set; }
        public ApplicationDTO       Application { get; set; }
        public TypeDeveloppementDTO TypeDeveloppement { get; set; }

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
            this.ListeRespProjet        = new List<Utilisateur>();
            this.Client                 = new Client();
            this.Application            = new ApplicationDTO();
            this.TypeDeveloppement      = new TypeDeveloppementDTO();
        }
    }
}
