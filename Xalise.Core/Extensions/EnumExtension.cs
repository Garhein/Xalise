using System.ComponentModel;
using System.Reflection;
using System.Runtime.CompilerServices;
using Xalise.Core.Attributes;

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

        /// <summary>
        /// Récupère la valeur de l'attribut <see cref="CssClassNameAttribute"/> indiqué sur le membre de l'énumération.
        /// </summary>
        /// <param name="enumValue"></param>
        /// <returns>La ou les classe(s) CSS positionnée(s) sur le membre <paramref name="enumValue"/>.</returns>
        public static string CssClassName(this Enum enumValue)
        {
            string cssClassName = string.Empty;

            Type type = enumValue.GetType();
            if (type != null)
            {
                FieldInfo? fi = type.GetField(enumValue.ToString());
                if (fi != null)
                {
                    IEnumerable<Attribute> attributes = fi.GetCustomAttributes(typeof(CssClassNameAttribute));
                    if (attributes.IsNotEmpty())
                    {
                        cssClassName = ((CssClassNameAttribute)attributes.First()).ClassName;
                    }
                }
            }

            return cssClassName;
        }

        /// <summary>
        /// Convertit un membre d'une énumération en un <see cref="int"/>.
        /// </summary>
        /// <typeparam name="TEnum"></typeparam>
        /// <param name="enumValue"></param>
        /// <exception cref="Exception">Si le type de <paramref name="enumValue"/> n'est pas compatible avec un <see cref="int"/>.</exception>
        /// <returns>Valeur du membre de l'énumération.</returns>
        public static int AsInteger<TEnum>(this TEnum enumValue) where TEnum : Enum
        {
            if (Unsafe.SizeOf<TEnum>() != Unsafe.SizeOf<int>())
            {
                throw new Exception("Type incompatible : l'énumération n'hérite pas du type 'int'.");
            }

            int valInt = Unsafe.As<TEnum, int>(ref enumValue);

            return valInt;
        }

        /// <summary>
        /// Convertit un membre d'une énumération en un <see cref="short"/>.
        /// </summary>
        /// <typeparam name="TEnum"></typeparam>
        /// <param name="enumValue"></param>
        /// <exception cref="Exception">Si le type de <paramref name="enumValue"/> n'est pas compatible avec un <see cref="short"/>.</exception>
        /// <returns>Valeur du membre de l'énumération.</returns>
        public static int AsShort<TEnum>(this TEnum enumValue) where TEnum : Enum
        {
            if (Unsafe.SizeOf<TEnum>() != Unsafe.SizeOf<short>())
            {
                throw new Exception("Type incompatible : l'énumération n'hérite pas du type 'short'.");
            }

            short valShort = Unsafe.As<TEnum, short>(ref enumValue);

            return valShort;
        }
    }
}