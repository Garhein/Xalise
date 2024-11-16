using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;

namespace Xalise.Core.Extensions
{
    /// <summary>
    /// Méthodes d'extensions applicables aux <see cref="Enum"/>.
    /// </summary>
    public static class EnumExtension
    {
        /// <summary>
        /// Récupère la valeur de l'attribut <see cref="DescriptionAttribute"/> indiqué sur le membre de l'énumération.
        /// </summary>
        /// <param name="enumValue"></param>
        /// <returns>Description positionnée sur le membre <paramref name="enumValue"/>.</returns>
        public static string Description(this Enum enumValue)
        {
            string descr = string.Empty;

            Type type = enumValue.GetType();
            if (type != null)
            {
                FieldInfo? fi = type.GetField(enumValue.ToString());
                if (fi != null)
                {
                    IEnumerable<Attribute> attributes = fi.GetCustomAttributes(typeof(DescriptionAttribute));
                    if (attributes.IsNotEmpty())
                    {
                        descr = ((DescriptionAttribute)attributes.First()).Description;
                    }
                }
            }

            return descr;
        }
    }
}
