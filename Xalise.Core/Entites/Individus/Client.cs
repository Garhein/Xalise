using System.ComponentModel.DataAnnotations;

namespace Xalise.Core.Entites.Individus
{
    [Serializable]
    public class Client
    {
        public int      Id { get; set; }

        [MaxLength(100)]
        public string   RaisonSociale { get; set; }
        public bool     EstGestionnaire { get; set; }

        /// <summary>
        /// Constructeur par défaut.
        /// </summary>
        public Client()
        {
            this.Id                 = 0;
            this.RaisonSociale      = string.Empty;
            this.EstGestionnaire    = false;
        }
    }
}
