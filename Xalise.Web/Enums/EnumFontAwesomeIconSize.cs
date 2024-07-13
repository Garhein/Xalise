using Xalise.Core.Attributes;

namespace Xalise.Web.Enums
{
    /// <summary>
    /// Taille de l'icône FontAwesome.
    /// </summary>
    public enum eFontAwesomeIconSize
    {
        [CssClassName("fa-xs")]
        xs,
        [CssClassName("fa-2xs")]
        double_xs,
        [CssClassName("fa-sm")]
        sm,
        [CssClassName("fa-lg")]
        lg,
        [CssClassName("fa-xl")]
        xl,
        [CssClassName("fa-2xl")]
        double_xl
    }
}
