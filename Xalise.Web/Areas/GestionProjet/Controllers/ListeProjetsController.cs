using Microsoft.AspNetCore.Mvc;
using Xalise.Core.Entites.GestionProjet;
using Xalise.Core.Entites.Individus;
using Xalise.Core.Entites.Technique;
using Xalise.Core.Extensions;
using Xalise.Web.Areas.GestionProjet.Models;
using Xalise.Web.Controllers;
using Xalise.Web.Helpers;
using Xalise.Web.Helpers.WebHelpers;

namespace Xalise.Web.Areas.GestionProjet.Controllers
{
    [Area("GestionProjet")]
    public class ListeProjetsController : XaliseMvcController
    {
        private readonly ILogger<ListeProjetsController> _logger;

        public ListeProjetsController(ILogger<ListeProjetsController> logger)
        {
            this._logger = logger;
        }

        /// <summary>
        /// Affiche la page de la liste des projets.
        /// </summary>
        /// <returns></returns>
        public IActionResult Index()
        {
            this.InitViewDataPageTitle("Liste des projets");

            // =-=-=-
            // Initialisation des critères de recherche
            // =-=-=-

            List<ApplicationDTO> listeApp           = JsonHelper.ReadEntities<ApplicationDTO>(JsonHelper.CSTS_FILENAME_APPLICATION);
            List<TypeDeveloppementDTO> listeTypeDev = JsonHelper.ReadEntities<TypeDeveloppementDTO>(JsonHelper.CSTS_FILENAME_TYPE_DEVELOPPEMENT);

            ListeProjetsCriteresRechercheModel criteres = new ListeProjetsCriteresRechercheModel();
            criteres.ListeApplication       = SelectListHelper.ConstruireListeDeroulanteApplication(listeApp);
            criteres.ListeTypeDeveloppement = SelectListHelper.ConstruireListeDeroulanteTypeDeveloppement(listeTypeDev);

            return View(this.RechercherListeProjets(criteres));
        }

        /// <summary>
        /// Exécution de la recherche.
        /// </summary>
        /// <param name="criteres">Critères de recherche.</param>
        /// <returns>Modèle de données contenant les critères de recherche et les résultats de celle-ci.</returns>
        private ListeProjetsViewModel RechercherListeProjets(ListeProjetsCriteresRechercheModel criteres)
        {
            ListeProjetsViewModel model = new ListeProjetsViewModel
            {
                CriteresRecherche = criteres
            };

            List<Projet> listeProjets               = JsonHelper.ReadEntities<Projet>(JsonHelper.CSTS_FILENAME_PROJET);
            List<Application> listeApp              = JsonHelper.ReadEntities<Application>(JsonHelper.CSTS_FILENAME_APPLICATION);
            List<TypeDeveloppement> listeTypeDev    = JsonHelper.ReadEntities<TypeDeveloppement>(JsonHelper.CSTS_FILENAME_TYPE_DEVELOPPEMENT);
            List<Utilisateur> listeUtilisateurs     = JsonHelper.ReadEntities<Utilisateur>(JsonHelper.CSTS_FILENAME_UTILISATEUR);
            List<Client> listeClients               = JsonHelper.ReadEntities<Client>(JsonHelper.CSTS_FILENAME_CLIENT);

            if (listeProjets.IsNotEmpty())
            {
                foreach (Projet projet in listeProjets)
                {
                    ProjetDTO dto = new ProjetDTO(projet);

                    IEnumerable<Client> tmpClient = listeClients.Where(x => x.Id == projet.ClientId);
                    if (tmpClient.IsNotEmpty())
                    {
                        dto.Client = new ClientDTO(tmpClient.First());
                    }

                    IEnumerable<Application> tmpApplication = listeApp.Where(x => x.Id == projet.ApplicationId);
                    if (tmpApplication.IsNotEmpty())
                    {
                        dto.Application = new ApplicationDTO(tmpApplication.First());
                    }

                    IEnumerable<TypeDeveloppement> tmpTypeDev = listeTypeDev.Where(x => x.Id == projet.TypeDeveloppementId);
                    if (tmpTypeDev.IsNotEmpty())
                    {
                        dto.TypeDeveloppement = new TypeDeveloppementDTO(tmpTypeDev.First());
                    }

                    IEnumerable<Utilisateur> tmpUtilisateur = listeUtilisateurs.Where(x => projet.RespProjetId.Contains(x.Id));
                    if (tmpUtilisateur.IsNotEmpty())
                    {
                        foreach (Utilisateur user in tmpUtilisateur)
                        {
                            dto.ListeRespProjet.Add(new UtilisateurDTO(user));
                        }
                    }

                    // model.ListeProjets.Add(dto);
                }
            }

            return model;
        }
    }
}
