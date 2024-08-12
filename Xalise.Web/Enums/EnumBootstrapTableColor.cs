using Xalise.Core.Attributes;

namespace Xalise.Web.Enums
{
    /// <summary>
    /// Couleur des tables Bootstrap.
    /// </summary>
    public enum eBootstrapTableColor
    {
        [CssClassName("table-primary")]
        table_primary,
        [CssClassName("table-secondary")]
        table_secondary,
        [CssClassName("table-success")]
        table_success,
        [CssClassName("table-danger")]
        table_danger,
        [CssClassName("table-warning")]
        table_warning,
        [CssClassName("table-info")]
        table_info,
        [CssClassName("table-light")]
        table_light,
        [CssClassName("table-dark")]
        table_dark
    }
}
