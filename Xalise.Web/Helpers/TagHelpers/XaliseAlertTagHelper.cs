using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Razor.TagHelpers;
using System.Text.Encodings.Web;
using Xalise.Core.Extensions;
using Xalise.Web.Enums;
using Xalise.Web.Helpers.WebHelpers;

namespace Xalise.Web.Helpers.TagHelpers
{
    /// <summary>
    /// Alerte bootstrap pouvant contenir une icône fontawesome.
    /// </summary>
    public class XaliseAlertTagHelper : TagHelper
    {
        public string                   CssClasses { get; set; }
        public eBootstrapAlert          AlertStyle { get; set; }
        public eFontAwesomeIconStyle?   IconStyle { get; set; }
        public eFontAwesomeIcon?        Icon { get; set; }

        /// <summary>
        /// Constructeur par défaut.
        /// </summary>
        public XaliseAlertTagHelper()
        {
            this.CssClasses = string.Empty;
        }

        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            // =-=-=-
            // Définition des classes CSS
            // =-=-=-

            string cssClasses = this.CssClasses;
            
            if (cssClasses.IsNotNullOrWhiteSpace())
            {
                cssClasses += " ";
            }

            cssClasses += $"alert {this.AlertStyle.CssClassName()}";

            // =-=-=-
            // Gestion des classes CSS supplémentaires
            // =-=-=-

            if (this.Icon.HasValue && this.IconStyle.HasValue)
            {
                cssClasses += " d-flex align-items-center justify-content-center";
            }
            else
            {
                cssClasses += " text-center";
            }

            // =-=-=-
            // Définition du contenu
            // =-=-=-

            if (this.Icon.HasValue && this.IconStyle.HasValue)
            {
                // Avec icône
                HtmlString iconHtml = new HtmlString("");
                TagBuilder faIcon   = new TagBuilder("i");
                faIcon.AddCssClass(FontAwesomeHelper.FontAwesomeClass(this.IconStyle.Value, this.Icon.Value) + " flex-shrink-0 me-2");

                using (StringWriter writer = new StringWriter())
                {
                    faIcon.WriteTo(writer, HtmlEncoder.Default);
                    iconHtml = new HtmlString(writer.ToString());
                }

                output.PreContent.AppendHtml(iconHtml);
            }

            // =-=-=-
            // Gestion finale du tag
            // =-=-=-

            output.TagMode = TagMode.StartTagAndEndTag;
            output.TagName = "div";
            output.Attributes.SetAttribute("role", "alert");
            output.Attributes.SetAttribute("class", cssClasses);
        }
    }
}
