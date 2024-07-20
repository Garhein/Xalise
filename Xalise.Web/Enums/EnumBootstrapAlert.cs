using Xalise.Core.Attributes;

namespace Xalise.Web.Enums
{
    /// <summary>
    /// Alerte Bootstrap.
    /// </summary>
    public enum eBootstrapAlert
    {
        [CssClassName("alert-primary")]
        alert_primary,
        [CssClassName("alert-secondary")]
        alert_secondary,
        [CssClassName("alert-success")]
        alert_success,
        [CssClassName("alert-danger")]
        alert_danger,
        [CssClassName("alert-warning")]
        alert_warning,
        [CssClassName("alert-info")]
        alert_info,
        [CssClassName("alert-light")]
        alert_light,
        [CssClassName("alert-dark")]
        alert_dark
    }
}
