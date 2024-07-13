using Xalise.Core.Attributes;

namespace Xalise.Web.Enums
{
    /// <summary>
    /// Taille des boutons Bootstrap.
    /// </summary>
    public enum eBootstrapButtonStyle
    {
        [CssClassName("btn-primary")]
        btn_primary,
        [CssClassName("btn-secondary")]
        btn_secondary
    }
}
