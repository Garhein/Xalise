using Xalise.Core.Entites.GestionProjet;

namespace Xalise.Web.Areas.GestionProjet.Models
{
    [Serializable]
    public class ListeProjetsViewModel
    {
        public ListeProjetsCriteresRechercheModel CriteresRecherche { get; set; }
        public List<Projet> ListeProjets { get; set; }

        /// <summary>
        /// Constructeur par défaut.
        /// </summary>
        public ListeProjetsViewModel()
        {
            this.CriteresRecherche  = new ListeProjetsCriteresRechercheModel();
            this.ListeProjets       = new List<Projet>();
        }
    }
}
