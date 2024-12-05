using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Xalise.Core.Extensions
{
    /// <summary>
    /// Extensions applicables aux <see cref="string"/>.
    /// </summary>
    /// <author>Xavier VILLEMIN - xavier.villemin@gmail.com</author>
    public static class StringExtension
    {
        /// <summary>
        /// Indique si <paramref name="src"/> est <see langword="null"/> ou vide (<c>""</c> ou <see cref="string.Empty"/>).
        /// </summary>
        /// <param name="src">Chaîne à tester.</param>
        /// <returns><see langword="true"/> si <paramref name="src"/> est <see langword="null"/> ou vide (<c>""</c>) ; sinon <see langword="false"/>.</returns>
        public static bool IsNullOrEmpty(this string src)
        {
            return string.IsNullOrEmpty(src);
        }

        /// <summary>
        /// Indique si <paramref name="src"/> n'est pas <see langword="null"/> et non vide (<c>""</c> ou <see cref="string.Empty"/>).
        /// </summary>
        /// <param name="src">Chaîne à tester.</param>
        /// <returns><see langword="true"/> si <paramref name="src"/> n'est pas <see langword="null"/> et non vide (<c>""</c>) ; sinon <see langword="false"/>.</returns>
        public static bool IsNotNullOrEmpty(this string src)
        {
            return !string.IsNullOrEmpty(src);
        }

        /// <summary>
        /// Indique si <paramref name="src"/> est <see langword="null"/>, vide (<c>""</c> ou <see cref="string.Empty"/>) ou composée uniquement d'espaces.
        /// </summary>
        /// <param name="src">Chaîne à tester.</param>
        /// <returns><see langword="true"/> si <paramref name="src"/> est <see langword="null"/>, vide (<c>""</c> ou <see cref="string.Empty"/>) ou composée uniquement d'espaces ; sinon <see langword="false"/>.</returns>
        public static bool IsNullOrWhiteSpace(this string src)
        {
            return string.IsNullOrWhiteSpace(src);
        }

        /// <summary>
        /// Indique si <paramref name="src"/> n'est pas <see langword="null"/>, vide (<c>""</c> ou <see cref="string.Empty"/>) et composée uniquement d'espaces.
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

            if (retVal.IsNotNullOrWhiteSpace() && retVal.Length > maxLength)
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

        /// <summary>
        /// Échappe <paramref name="src"/>.
        /// </summary>
        /// <remarks>
        /// L'échappement est réalisé caractère par caractère car une séquence d'échappement peut potentiellement introduire un caractère à échapper.<br/>
        /// Exemple : le caractère <c>\</c> doit être échappé mais une séquence d'échappement pour un autre caractère à remplacer correspond à <c>\F\</c>.
        /// </remarks>
        /// <param name="src">Chaîne à échapper.</param>
        /// <param name="escapeSequences">Définition des caracèteres à échapper et de leur valeur de remplacement.</param>
        /// <returns>Une chaîne nettoyée des caractères à échapper.</returns>
        /// <exception cref="ArgumentException">Si <paramref name="src"/> est <see cref="IsNullOrWhiteSpace(string)"/> ou que <paramref name="escapeSequences"/> est <see langword="null"/> ou vide.</exception>
        public static string EscapeText(this string src, Dictionary<char, string> escapeSequences)
        {
            if (src.IsNullOrWhiteSpace())
            {
                throw new ArgumentException("La chaîne à échapper ne peut pas être NULL, vide ou composée uniquement d'espaces.", nameof(src));
            }

            if (escapeSequences.IsEmpty())
            {
                throw new ArgumentException("La définition des caractères à remplacer et de leur valeur de remplacement n'est pas valide.", nameof(escapeSequences));
            }

            char[] chars             = src.ToCharArray();
            StringBuilder retBuilder = new StringBuilder();

            foreach (char charToEscape in chars)
            {
                if (escapeSequences.ContainsKey(charToEscape))
                {
                    retBuilder.Append(escapeSequences[charToEscape]);
                }
                else
                {
                    retBuilder.Append(charToEscape);
                }
            }

            return retBuilder.ToString();
        }

        /// <summary>
        /// Annule l'échappement de <paramref name="src"/>.
        /// </summary>
        /// <param name="src">Chaîne sur laquelle annuler l'échappement.</param>
        /// <param name="unescapeSequences">Définition des valeurs de remplacement et des caractères correspondants.</param>
        /// <returns>Une chaîne dans laquelle les valeurs de remplacement ont été remplacées par leur caractère respectif.</returns>
        /// <exception cref="ArgumentException">Si <paramref name="src"/> est <see cref="IsNullOrWhiteSpace(string)"/> ou que <paramref name="unescapeSequences"/> est <see langword="null"/> ou vide.</exception>
        public static string UnescapeText(this string src, Dictionary<string, char> unescapeSequences)
        {
            if (src.IsNullOrWhiteSpace())
            {
                throw new ArgumentException("La chaîne ne peut pas être NULL, vide ou composée uniquement d'espaces.", nameof(src));
            }

            if (unescapeSequences.IsEmpty())
            {
                throw new ArgumentException("La définition des valeurs de remplacement et des caractères correspondant n'est pas valide.", nameof(unescapeSequences));
            }

            char[] chars             = src.ToCharArray();
            StringBuilder retBuilder = new StringBuilder();

            int i = 0;

            while (i < chars.Length)
            {
                bool foundSequence = false;

                foreach (KeyValuePair<string, char> kvp in unescapeSequences)
                {
                    // S'il reste assez de caractères dans le tableau
                    if (i + kvp.Key.Length <= chars.Length)
                    {
                        string str = string.Join(string.Empty, chars.Take(new Range(i, i + kvp.Key.Length)));
                        if (str == kvp.Key)
                        {
                            retBuilder.Append(kvp.Value);
                            i = i + kvp.Key.Length;
                            foundSequence = true;
                            break;
                        }
                    }
                }

                if (foundSequence)
                {
                    continue;
                }
                else
                {
                    retBuilder.Append(chars[i]);
                }
                
                i++;
            }

            return retBuilder.ToString();
        }
    }
}
