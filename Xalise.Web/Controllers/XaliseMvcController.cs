using Microsoft.AspNetCore.Mvc;

namespace Xalise.Web.Controllers
{
    /// <summary>
    /// Classe parente de l'ensemble des contrôleurs.
    /// </summary>
    public class XaliseMvcController : Controller
    {
        #region ViewData

        /// <summary>
        /// Initialisation d'un <see cref="ViewData"/>.
        /// </summary>
        /// <param name="viewDataKey">Clé d'accès à la valeur stockée.</param>
        /// <param name="viewDataValue">Valeur à stocker.</param>
        public void InitViewData(string viewDataKey, object viewDataValue)
        {
            ViewData[viewDataKey] = viewDataValue;
        }

        /// <summary>
        /// Initialisation du <see cref="ViewData"/> stockant le titre de la page.
        /// </summary>
        /// <param name="pageTitle"></param>
        public void InitViewDataPageTitle(string pageTitle)
        {
            this.InitViewData("Title", pageTitle);
        }

        #endregion
    }
}
