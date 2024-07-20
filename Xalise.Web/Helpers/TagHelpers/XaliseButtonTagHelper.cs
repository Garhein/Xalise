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
    /// Bouton bootstrap pouvant contenir une icône fontawesome.
    /// </summary>
    public class XaliseButtonTagHelper : TagHelper
    {
        public string                   Title { get; set; }
        public string                   CssClasses { get; set; }
        public eBootstrapButtonSize?    Size { get; set; }
        public eBootstrapButtonStyle?   Style { get; set; }
        public eFontAwesomeIconStyle?   IconStyle { get; set; }
        public eFontAwesomeIcon?        Icon { get; set; }

        /// <summary>
        /// Constructeur par défaut.
        /// </summary>
        public XaliseButtonTagHelper()
        {
            this.Title      = string.Empty;
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

            cssClasses += "btn";
            
            if (this.Size.HasValue)
            {
                cssClasses = $"{cssClasses} {this.Size.Value.CssClassName()}";
            }

            if (this.Style.HasValue)
            {
                cssClasses = $"{cssClasses} {this.Style.Value.CssClassName()}";
            }

            // =-=-=-
            // Définition du contenu
            // =-=-=-

            if (this.Icon.HasValue && this.IconStyle.HasValue)
            {
                // Avec icône
                HtmlString iconHtml = new HtmlString("");
                TagBuilder faIcon   = new TagBuilder("i");
                faIcon.AddCssClass(FontAwesomeHelper.FontAwesomeClass(this.IconStyle.Value, this.Icon.Value) + " me-2");

                using (StringWriter writer = new StringWriter())
                {
                    faIcon.WriteTo(writer, HtmlEncoder.Default);
                    iconHtml = new HtmlString(writer.ToString());
                }

                output.Content.AppendHtml(iconHtml + this.Title);
            }
            else
            {
                // Sans icône
                output.Content.SetContent(this.Title);
            }

            // =-=-=-
            // Gestion finale du tag
            // =-=-=-

            output.TagMode = TagMode.StartTagAndEndTag;
            output.TagName = "button";
            output.Attributes.SetAttribute("type", "button");
            output.Attributes.SetAttribute("class", cssClasses);
        }
    }
}
