using System.ComponentModel;

namespace Xalise.Interop.HL7.Enums
{
    /// <summary>
    /// Condition d'usage des données.
    /// </summary>
    public enum EnumDataUsage : short
    {
        [Description("La donnée est obligatoire.")]
        REQUIRED                = 1,
        [Description("La donnée est optionnelle.")]
        OPTIONAL                = 2,
        [Description("L'utilisation de la donnée est soumise à une ou plusieurs conditions.")]
        CONDITIONAL             = 3,
        [Description("La donnée est indiquée à des fins de rétrocompatibilité.")]
        BACKWARD_COMPATIBILITY  = 4,
        [Description("L'utilisation de la donnée est interdite (IHE France PAM).")]
        FORBIDDEN               = 5,
        [Description("La donnée est obligatoire mais peut être vide (IHE France PAM).")]
        REQUIRED_OR_EMPTY       = 6
    }
}
