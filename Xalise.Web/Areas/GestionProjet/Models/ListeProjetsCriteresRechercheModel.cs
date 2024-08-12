using System.ComponentModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Xalise.Web.Models;

namespace Xalise.Web.Areas.GestionProjet.Models
{
    [Serializable]
    public class ListeProjetsCriteresRechercheModel : XaliseBaseCritereRechercheModel
    {
        [DisplayName("Client")]
        public string               Client { get; set; }
        [HiddenInput]
        public int?                 IdClient { get; set; }
        [DisplayName("Resp. projet")]
        public string               RespProjet { get; set; }
        [HiddenInput]
        public int?                 IdRespProjet { get; set; }
        [DisplayName("Projet interne")]
        public bool                 ProjetInterne { get; set; }
        public List<SelectListItem> ListeApplication {  get; set; }
        [DisplayName("Application")]
        public int?                 IdApplication { get; set; }
        public List<SelectListItem> ListeTypeDeveloppement {  get; set; }
        [DisplayName("Type")]
        public int?                 IdTypeDeveloppement { get; set; }
        [DisplayName("Non commencé")]
        public bool                 EstNonCommence { get; set; }
        [DisplayName("En cours")]
        public bool                 EstEnCours { get; set; }
        [DisplayName("Terminé")]
        public bool                 EstTermine { get; set; }
        [DisplayName("Annulé")]
        public bool                 EstAnnule { get; set; }

        /// <summary>
        /// Constructeur par défaut.
        /// </summary>
        public ListeProjetsCriteresRechercheModel()
        {
            this.Client                 = string.Empty;
            this.IdClient               = null;
            this.RespProjet             = string.Empty;
            this.IdRespProjet           = null;
            this.ProjetInterne          = false;
            this.ListeApplication       = new List<SelectListItem>();
            this.IdApplication          = null;
            this.ListeTypeDeveloppement = new List<SelectListItem>();
            this.IdTypeDeveloppement    = null;
            this.EstNonCommence         = false;
            this.EstEnCours             = false;
            this.EstTermine             = false;
            this.EstAnnule              = false;
        }
    }
}
