using System;
using System.Linq;

namespace Xalise.Core.Extensions
{
    /// <summary>
    /// Extensions applicables aux <see cref="string"/>.
    /// </summary>
    /// <author>Xavier VILLEMIN - xavier.villemin@gmail.com</author>
    public static class StringExtension
    {
        /// <summary>
        /// Indique si une chaîne est <see langword="null"/> ou vide (<c>""</c> ou <see cref="string.Empty"/>).
        /// </summary>
        /// <param name="src">Chaîne à tester.</param>
        /// <returns><see langword="true"/> si <paramref name="src"/> est <see langword="null"/> ou vide (<c>""</c>) ; sinon <see langword="false"/>.</returns>
        public static bool IsNullOrEmpty(this string src)
        {
            return string.IsNullOrEmpty(src);
        }

        /// <summary>
        /// Indique si une chaîne n'est pas <see langword="null"/> et non vide (<c>""</c> ou <see cref="string.Empty"/>).
        /// </summary>
        /// <param name="src">Chaîne à tester.</param>
        /// <returns><see langword="true"/> si <paramref name="src"/> n'est pas <see langword="null"/> et non vide (<c>""</c>) ; sinon <see langword="false"/>.</returns>
        public static bool IsNotNullOrEmpty(this string src)
        {
            return !string.IsNullOrEmpty(src);
        }

        /// <summary>
        /// Indique si une chaîne est <see langword="null"/>, vide (<c>""</c> ou <see cref="string.Empty"/>) ou composée uniquement d'espaces.
        /// </summary>
        /// <param name="src">Chaîne à tester.</param>
        /// <returns><see langword="true"/> si <paramref name="src"/> est <see langword="null"/>, vide (<c>""</c> ou <see cref="string.Empty"/>) ou composée uniquement d'espaces ; sinon <see langword="false"/>.</returns>
        public static bool IsNullOrWhiteSpace(this string src)
        {
            return string.IsNullOrWhiteSpace(src);
        }

        /// <summary>
        /// Indique si une chaîne n'est pas <see langword="null"/>, vide (<c>""</c> ou <see cref="string.Empty"/>) et composée uniquement d'espaces.
        /// </summary>
        /// <param name="src">Chaîne à tester.</param>
        /// <returns><see langword="true"/> si <paramref name="src"/> n'est pas <see langword="null"/>, vide (<c>""</c> ou <see cref="string.Empty"/>) et composée uniquement d'espaces ; sinon <see langword="false"/>.</returns>
        public static bool IsNotNullOrWhiteSpace(this string src)
        {
            return !string.IsNullOrWhiteSpace(src);
        }

        /// <summary>
        /// Tronque <paramref name="src"/> si la longueur est supérieure à <paramref name="maxLength"/>.
        /// </summary>
        /// <param name="src">Chaîne à tronquer.</param>
        /// <param name="maxLength">Longueur maximale à conserver.</param>
        /// <param name="startFromLeft"><see langword="true"/> si on tronque à partir du début de <paramref name="src"/> et <see langword="false"/> si on tronque à partir de la fin de <paramref name="src"/>.</param>
        /// <returns>Une chaîne dont la taille maximale correspond à <paramref name="maxLength"/>.</returns>
        /// <exception cref="ArgumentException">Si <paramref name="maxLength"/> est inférieur ou égal à 0.</exception>
        public static string Truncate(this string src, int maxLength, bool startFromLeft = true)
        {
            if (maxLength <= 0)
            {
                throw new ArgumentException("Longueur maximale non valide.", nameof(maxLength));
            }

            string retVal = src;

            if (!string.IsNullOrWhiteSpace(retVal) && retVal.Length > maxLength)
            {
                if (startFromLeft)
                {
                    retVal = retVal.Substring(0, maxLength);
                }
                else
                {
                    retVal = retVal.Substring(retVal.Length - maxLength, maxLength);
                }
            }

            return retVal;
        }

        /// <summary>
        /// Vérifie si <paramref name="src"/> est composée de caractères uniques.
        /// </summary>
        /// <param name="src">Chaîne à vérifier.</param>
        /// <returns><see langword="true"/> si <paramref name="src"/> est composée de caractères uniques ; sinon <see langword="false"/>.</returns>
        /// <exception cref="ArgumentException">Si <paramref name="src"/> est <see cref="IsNullOrWhiteSpace(string)"/>.</exception>
        public static bool CharsAreUnique(this string src)
        {
            if (src.IsNullOrWhiteSpace())
            {
                throw new ArgumentException("La chaîne à vérifier ne peut pas être NULL, vide ou composée uniquement d'espaces.", nameof(src));
            }

            var chars       = src.ToCharArray();
            var distinct    = chars.Distinct().ToArray();

            return chars.Length == distinct.Length;
        }

        /// <summary>
        /// Retire de <paramref name="src"/> les caractères identiques et successifs.
        /// </summary>
        /// <param name="src">Chaîne à traiter.</param>
        /// <param name="charToRemove">Caractère à retirer.</param>
        /// <param name="startFromLeft"><see langword="true"/> si la recherche commence par le début de <paramref name="src"/>, sinon la recherche commence par la fin de <paramref name="src"/>.</param>
        /// <returns>Une chaîne nettoyée des caractères identiques et successifs.</returns>
        /// <exception cref="ArgumentException">Si <paramref name="src"/> est <see cref="IsNullOrWhiteSpace(string)"/>.</exception>
        public static string RemoveIdenticalSuccessiveChars(this string src, char charToRemove, bool startFromLeft = true)
        {
            if (src.IsNullOrWhiteSpace())
            {
                throw new ArgumentException("La chaîne à vérifier ne peut pas être NULL, vide ou composée uniquement d'espaces.", nameof(src));
            }

            char[] chars = src.ToCharArray();
            string ret   = string.Empty;

            if (!startFromLeft)
            {
                chars = chars.Reverse().ToArray();
            }

            int posChar = 0;
            bool found  = false;

            while (posChar < chars.Length && !found)
            {
                if (chars[posChar] != charToRemove)
                {
                    found = true;
                }
                else
                {
                    posChar++;
                }
            }

            if (found)
            {
                char[] charsToKeep = new char[chars.Length - posChar];

                if (startFromLeft)
                {
                    Array.Copy(chars, posChar, charsToKeep, 0, chars.Length - posChar);
                }
                else
                {
                    Array.Copy(chars, posChar, charsToKeep, 0, chars.Length - posChar);
                    charsToKeep = charsToKeep.Reverse().ToArray();
                }

                ret = new string(charsToKeep);
            }

            return ret;
        }
    }
}
