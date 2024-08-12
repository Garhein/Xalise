using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using Xalise.Core.Entites.GestionProjet;
using Xalise.Core.Extensions;
using Xalise.Web.Enums;

namespace Xalise.Web.Areas.GestionProjet.Models
{
    [Serializable]
    public class ListeProjetsViewModel
    {
        public ListeProjetsCriteresRechercheModel CriteresRecherche { get; set; }
        public List<ProjetDTO> ListeProjets { get; set; }

        /// <summary>
        /// Constructeur par défaut.
        /// </summary>
        public ListeProjetsViewModel()
        {
            this.CriteresRecherche  = new ListeProjetsCriteresRechercheModel();
            this.ListeProjets       = new List<ProjetDTO>();
        }

        /// <summary>
        /// Définition du style à appliquer sur la colonne du pourcentage d'écart.
        /// </summary>
        /// <param name="pourcentageEcart"></param>
        /// <returns></returns>
        public string UClassNamePourcentageEcart(decimal pourcentageEcart)
        {
            string cssClass = string.Empty;

            if (pourcentageEcart >= 1 && pourcentageEcart <= 25)
            {
                cssClass = eBootstrapTableColor.table_info.CssClassName();
            }
            else if (pourcentageEcart > 25 &&  pourcentageEcart <= 50)
            {
                cssClass = eBootstrapTableColor.table_warning.CssClassName();
            }
            else if (pourcentageEcart > 50)
            {
                cssClass = eBootstrapTableColor.table_danger.CssClassName();
            }
 
            return cssClass;
        }

        public string UTooltipPourcentageEcart(ProjetDTO dto)
        {
            TagBuilder tagDiv = new TagBuilder("div");
            tagDiv.AddCssClass("text-start");

            // =-=-=-
            // Temps estimé
            // =-=-=-

            TagBuilder infosTpsEstime = new TagBuilder("p");
            infosTpsEstime.AddCssClass("d-block mb-0");

            TagBuilder lblTpsEstime = new TagBuilder("span");
            lblTpsEstime.InnerHtml.SetContent("Temps estimé : ");

            using (StringWriter writer = new StringWriter())
            {
                lblTpsEstime.WriteTo(writer, HtmlEncoder.Default);
                infosTpsEstime.InnerHtml.AppendHtml(writer.ToString());
            }

            TagBuilder spanTpsEstime = new TagBuilder("span");
            spanTpsEstime.InnerHtml.SetContent($"{dto.TempsEstime}");

            using (StringWriter writer = new StringWriter())
            {
                spanTpsEstime.WriteTo(writer, HtmlEncoder.Default);
                infosTpsEstime.InnerHtml.AppendHtml(writer.ToString());
            }

            using (StringWriter writer = new StringWriter())
            {
                infosTpsEstime.WriteTo(writer, HtmlEncoder.Default);
                tagDiv.InnerHtml.AppendHtml(writer.ToString());
            }

            // =-=-=-
            // Temps réel
            // =-=-=-

            TagBuilder infosTpsReel = new TagBuilder("p");
            infosTpsReel.AddCssClass("d-block mb-0");

            TagBuilder lblTpsReel = new TagBuilder("span");
            lblTpsReel.InnerHtml.SetContent("Temps réel : ");

            using (StringWriter writer = new StringWriter())
            {
                lblTpsReel.WriteTo(writer, HtmlEncoder.Default);
                infosTpsReel.InnerHtml.AppendHtml(writer.ToString());
            }

            TagBuilder spanTpsReel = new TagBuilder("span");
            spanTpsReel.InnerHtml.SetContent($"{dto.TempsReel}");

            using (StringWriter writer = new StringWriter())
            {
                spanTpsReel.WriteTo(writer, HtmlEncoder.Default);
                infosTpsReel.InnerHtml.AppendHtml(writer.ToString());
            }

            using (StringWriter writer = new StringWriter())
            {
                infosTpsReel.WriteTo(writer, HtmlEncoder.Default);
                tagDiv.InnerHtml.AppendHtml(writer.ToString());
            }

            // =-=-=-
            // Pourcentage écart
            // =-=-=-

            TagBuilder infosPourcEcart = new TagBuilder("p");
            infosPourcEcart.AddCssClass("d-block mb-0");

            TagBuilder lblPourcEcart = new TagBuilder("span");
            lblPourcEcart.InnerHtml.SetContent("% écart : ");

            using (StringWriter writer = new StringWriter())
            {
                lblPourcEcart.WriteTo(writer, HtmlEncoder.Default);
                infosPourcEcart.InnerHtml.AppendHtml(writer.ToString());
            }

            TagBuilder spanPourcEcart = new TagBuilder("span");
            spanPourcEcart.InnerHtml.SetContent($"{dto.PourcentageEcart}");

            using (StringWriter writer = new StringWriter())
            {
                spanPourcEcart.WriteTo(writer, HtmlEncoder.Default);
                infosPourcEcart.InnerHtml.AppendHtml(writer.ToString());
            }

            using (StringWriter writer = new StringWriter())
            {
                infosPourcEcart.WriteTo(writer, HtmlEncoder.Default);
                tagDiv.InnerHtml.AppendHtml(writer.ToString());
            }

            string retVal = string.Empty;

            if (tagDiv.HasInnerHtml)
            {
                using (StringWriter writer = new StringWriter())
                {
                    tagDiv.WriteTo(writer, HtmlEncoder.Default);
                    retVal = writer.ToString();
                }
            }

            return retVal;
        }
    }
}
