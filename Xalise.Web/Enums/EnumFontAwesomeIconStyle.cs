using Xalise.Core.Attributes;

namespace Xalise.Web.Enums
{
    /// <summary>
    /// Style de l'icône FontAwesome.
    /// </summary>
    public enum eFontAwesomeIconStyle
    {
        [CssClassName("fa-solid")]
        solid,
        [CssClassName("fa-regular")]
        regular,
        [CssClassName("fa-light")]
        light
    }
}
