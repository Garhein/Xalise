using Microsoft.AspNetCore.Mvc;
using Xalise.Core.Entites.GestionProjet;
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
            /*
            List<Client> listeClients = new List<Client>();

            listeClients.Add(new Client
            {
                Id  = 1,
                RaisonSociale   = "Xalise",
                EstGestionnaire = true
            });

            listeClients.Add(new Client
            {
                Id  = 2,
                RaisonSociale   = "AP-HP",
                EstGestionnaire = false
            });

            listeClients.Add(new Client
            {
                Id  = 3,
                RaisonSociale   = "Fondation Santé Service",
                EstGestionnaire = false
            });

            listeClients.Add(new Client
            {
                Id  = 4,
                RaisonSociale   = "Croix-Rouge Française",
                EstGestionnaire = false
            });

            JsonHelper.WriteEntities<Client>(JsonHelper.CSTS_FILENAME_CLIENT, listeClients);

            List<Utilisateur> listeUtilisateurs = new List<Utilisateur>();

            listeUtilisateurs.Add(new Utilisateur
            {
                Id  = 1,
                Nom     = "VILLEMIN",
                Prenom  = "Xavier"
            });

            listeUtilisateurs.Add(new Utilisateur
            {
                Id      = 2,
                Nom     = "PORIAU",
                Prenom  = "Yennick"
            });

            listeUtilisateurs.Add(new Utilisateur
            {
                Id      = 3,
                Nom     = "MAIRET",
                Prenom  = "Grégory"
            });

            listeUtilisateurs.Add(new Utilisateur
            {
                Id      = 4,
                Nom     = "BATTUNG",
                Prenom  = "Magalie"
            });

            listeUtilisateurs.Add(new Utilisateur
            {
                Id      = 5,
                Nom     = "MILLOT",
                Prenom  = "Damien"
            });

            listeUtilisateurs.Add(new Utilisateur
            {
                Id      = 6,
                Nom     = "DUBOURG",
                Prenom  = "Justine"
            });

            listeUtilisateurs.Add(new Utilisateur
            {
                Id      = 7,
                Nom     = "ANDRIN",
                Prenom  = "Laurence"
            });

            listeUtilisateurs.Add(new Utilisateur
            {
                Id      = 8,
                Nom     = "PEREIRA",
                Prenom  = "Carine"
            });

            JsonHelper.WriteEntities<Utilisateur>(JsonHelper.CSTS_FILENAME_UTILISATEUR, listeUtilisateurs);

            List<Application> listeApplication = new List<Application>();

            listeApplication.Add(new Application
            {
                Id  = 1,
                Nom = "Xalise Project"
            });

            listeApplication.Add(new Application
            {
                Id  = 2,
                Nom = "Xalise API"
            });

            listeApplication.Add(new Application
            {
                Id  = 3,
                Nom = "Xalise MQ"
            });

            listeApplication.Add(new Application
            {
                Id  = 4,
                Nom = "Xalise CRM"
            });

            JsonHelper.WriteEntities<Application>(JsonHelper.CSTS_FILENAME_APPLICATION, listeApplication);

            List<TypeDeveloppement> listeTypeDev = new List<TypeDeveloppement>();

            listeTypeDev.Add(new TypeDeveloppement
            {
                Id  = 1,
                Nom = "Web"
            });

            listeTypeDev.Add(new TypeDeveloppement
            {
                Id  = 2,
                Nom = "API"
            });

            listeTypeDev.Add(new TypeDeveloppement
            {
                Id  = 3,
                Nom = "Analyse / Spécifications"
            });

            JsonHelper.WriteEntities<TypeDeveloppement>(JsonHelper.CSTS_FILENAME_TYPE_DEVELOPPEMENT, listeTypeDev);
            
            List<Projet> listeProjets = new List<Projet>();

            listeProjets.Add(new Projet
            {
                Id                      = 1,
                Intitule                = "Migration vers REST",
                Description             = "",
                PourcentageRealisation  = 12.25m,
                TempsEstime             = 15.5m,
                TempsReel               = 2.75m,
                PourcentageEcart        = 10.75m,
                RespProjetId            = new List<int> { 1, 7 },
                ClientId                = 1,
                ApplicationId           = 2,
                TypeDeveloppementId     = 2
            });

            JsonHelper.WriteEntities<Projet>(JsonHelper.CSTS_FILENAME_PROJET, listeProjets);
            */

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

        private ListeProjetsViewModel RechercherListeProjets(ListeProjetsCriteresRechercheModel criteres)
        {
            ListeProjetsViewModel model = new ListeProjetsViewModel
            {
                CriteresRecherche = criteres
            };

            List<Projet> listeProjets = JsonHelper.ReadEntities<Projet>(JsonHelper.CSTS_FILENAME_PROJET);

            if (listeProjets.IsNotEmpty())
            {
                foreach (Projet projet in listeProjets)
                {

                }
            }

            return model;
        }
    }
}
