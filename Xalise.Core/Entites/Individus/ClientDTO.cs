using System.ComponentModel.DataAnnotations;

namespace Xalise.Core.Entites.Individus
{
    [Serializable]
    public class ClientDTO
    {
        public int      Id { get; set; }

        [MaxLength(100)]
        public string   RaisonSociale { get; set; }
        public bool     EstGestionnaire { get; set; }

        /// <summary>
        /// Constructeur par défaut.
        /// </summary>
        public ClientDTO()
        {
            this.Id                 = 0;
            this.RaisonSociale      = string.Empty;
            this.EstGestionnaire    = false;
        }

        /// <summary>
        /// Constructeur.
        /// </summary>
        /// <param name="client">Client à partir duquel instancier le DTO.</param>
        public ClientDTO(Client client) : this()
        {
            if (client != null)
            {
                this.Id                 = client.Id;
                this.RaisonSociale      = client.RaisonSociale;
                this.EstGestionnaire    = client.EstGestionnaire;
            }
        }
    }
}
