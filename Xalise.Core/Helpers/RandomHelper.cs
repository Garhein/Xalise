using System;

namespace Xalise.Core.Helpers
{
    /// <summary>
    /// Fonctions de manipulation associées à <see cref="Random"/>.
    /// </summary>
    /// <author>Xavier VILLEMIN - xavier.villemin@gmail.com</author>
    public static class RandomHelper
    {
        /// <summary>
        /// Génère une valeur entière aléatoire.
        /// </summary>
        /// <remarks>
        /// Les limites ne sont pas exclues de la génération de la valeur.
        /// </remarks>
        /// <param name="minValue">Limite inférieure du nombre aléatoire retourné.</param>
        /// <param name="maxValue">Limite supérieure du nombre aléatoire retourné.</param>
        /// <returns>Une valeur aléatoire comprise entre <paramref name="minValue"/> et <paramref name="maxValue"/>.</returns>
        public static int GenerateRandomValue(int minValue, int maxValue)
        {
            /// Nécessaire de faire +1 sur la valeur maximale car elle est exclue par la méthode <seealso cref="Random.Next(int, int)"/>.
            return new Random().Next(minValue, maxValue + 1);
        }
    }
}
