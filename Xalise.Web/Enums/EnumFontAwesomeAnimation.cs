using Xalise.Core.Attributes;

namespace Xalise.Web.Enums
{
    /// <summary>
    /// Animation de l'icône FontAwesome.
    /// </summary>
    public enum eFontAwesomeAnimation
    {
        [CssClassName("fa-spin")]
        spin,
        [CssClassName("fa-spin-reverse")]
        spin_reverse,
        [CssClassName("fa-spin-pulse")]
        spin_pulse
    }
}
