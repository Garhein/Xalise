using System.Text;
using Xalise.Core.Extensions;
using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Core;
using Xalise.Interop.HL7.Helpers;

namespace Xalise.Interop.HL7.Parser
{
    [Serializable]
    public static class PipeParser
    {
        /// <summary>
        /// Encode un segment.
        /// </summary>
        /// <param name="segment">Segment à encoder.</param>
        /// <param name="encodingChars">Caractères d'encodage à utiliser.</param>
        /// <returns>Une chaîne représentant le segment encodé.</returns>
        public static string Encode(ISegment segment, EncodingCharacters encodingChars)
        {
            StringBuilder retSegment = new StringBuilder();

            // Code du segment et premier séparateur de champ
            retSegment.Append(segment.StructureName);
            retSegment.Append(encodingChars.FieldSeparator);

            // Commencer le parcours des champs à la position 2 si le segment définit les caractères d'encodage
            int startPos = !SegmentHelper.IsSegmentDefDelimiters(segment.StructureName) ? 1 : 2;

            // Parcours des champs
            for (int i = startPos; i <= segment.NumberOfFields; i++)
            {
                try
                {
                    // Parcours des répétitions
                    IType[] repetitions = segment.GetField<IType>(i);

                    for (int j = 0; j < repetitions.Length; j++)
                    {
                        string repValue = PipeParser.Encode(repetitions[j], encodingChars);

                        // Annuler l'échappement des caractères réservés si le segment définit les caractères d'encodage
                        if (SegmentHelper.IsSegmentDefDelimiters(segment.StructureName) && i == 2)
                        {
                            repValue = repValue.UnescapeText(encodingChars.UnescapeChars);
                        }

                        retSegment.Append(repValue);

                        if (j < repetitions.Length - 1)
                        {
                            retSegment.Append(encodingChars.RepetitionSeparator);
                        }
                    }
                }
                catch (HL7Exception)
                {
                    throw;
                }

                retSegment.Append(encodingChars.FieldSeparator);
            }

            return retSegment.ToString().RemoveIdenticalSuccessiveChars(encodingChars.FieldSeparator, false);
        }

        /// <summary>
        /// Encode un type de données.
        /// </summary>
        /// <param name="type">Type de données à encoder.</param>
        /// <param name="encodingChars">Caractères d'encodage à utiliser.</param>
        /// <param name="subComponent">Indique si on encode un sous-composant du type de données.</param>
        /// <returns>Une chaîne représentant le type de données encodé.</returns>
        /// <exception cref="ParserException">Si <paramref name="type"/> ne peut pas être convertit en <see cref="ITypePrimitive"/> ou <see cref="ITypeComposite"/>.</exception>
        public static string Encode(IType type, EncodingCharacters encodingChars, bool subComponent = false)
        {
            StringBuilder retType = new StringBuilder();

            if (type is ITypePrimitive)
            {
                if (type is not ITypePrimitive primitive)
                {
                    throw new ParserException("Une erreur inattendue s'est produite lors de la conversion de IType en ITypePrimitive.");
                }
                else
                {
                    retType.Append(PipeParser.Encode(primitive, encodingChars));
                }
            }
            else
            {
                if (type is not ITypeComposite composite)
                {
                    throw new ParserException("Une erreur inattendue s'est produite lors de la conversion de IType en ITypeComposite.");
                }
                else
                {
                    // TODO: trouver une solution pour déterminer le niveau différemment
                    StringBuilder retComp   = new StringBuilder();
                    char compDelimiter      = subComponent ? encodingChars.SubComponentSeparator : encodingChars.ComponentSeparator;

                    for (int i = 0; i < composite.Components.Length; i++)
                    {
                        retComp.Append(PipeParser.Encode(composite.Components[i], encodingChars, true));
                        if (i < composite.Components.Length - 1)
                        {
                            retComp.Append(compDelimiter);
                        }
                    }

                    retType.Append(retComp.ToString().RemoveIdenticalSuccessiveChars(compDelimiter, false));
                }
            }

            return retType.ToString();
        }

        /// <summary>
        /// Encode un type de données primitif.
        /// </summary>
        /// <param name="primitive">Primitive à encoder.</param>
        /// <param name="encodingChars">Caractères d'encodage à utiliser.</param>
        /// <returns>Une chaîne représentant la primitive encodée.</returns>
        public static string Encode(ITypePrimitive primitive, EncodingCharacters encodingChars)
        {
            return primitive.Value.EscapeText(encodingChars.EscapeChars);
        }
    }
}
