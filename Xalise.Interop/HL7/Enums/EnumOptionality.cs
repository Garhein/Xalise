namespace Xalise.Interop.HL7.Enums
{
    /// <summary>
    /// Condition d'usage des données.
    /// </summary>
    public enum EnumDataUsage : short
    {
        REQUIRED                = 1,
        OPTIONAL                = 2,
        CONDITIONAL             = 3,
        BACKWARD_COMPATIBILITY  = 4
    }
}
