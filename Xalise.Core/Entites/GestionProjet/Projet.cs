using System.ComponentModel.DataAnnotations;

namespace Xalise.Core.Entites.GestionProjet
{
    [Serializable]
    public class Projet
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
        public List<int>            RespProjetId { get; set; }
        public int                  ClientId { get; set; }
        public int                  ApplicationId { get; set; }
        public int                  TypeDeveloppementId { get; set; }

        /// <summary>
        /// Constructeur par défaut.
        /// </summary>
        public Projet()
        {
            this.Id                     = 0;
            this.Intitule               = string.Empty;
            this.Description            = string.Empty;
            this.PourcentageRealisation = 0;
            this.TempsEstime            = 0;
            this.TempsReel              = 0;
            this.PourcentageEcart       = 0;
            this.RespProjetId           = new List<int>();
            this.ClientId               = 0;
            this.ApplicationId          = 0;
            this.TypeDeveloppementId    = 0;
        }
    }
}
