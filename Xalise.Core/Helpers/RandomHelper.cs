using System;

namespace Xalise.Core.Helpers
{
    /// <summary>
    /// Méthodes utilitaires associées à <see cref="Random"/>.
    /// </summary>
    public static class RandomHelper
    {
        /// <summary>
        /// Génère une valeur entière aléatoire.
        /// </summary>
        /// <param name="minValue">Limite inférieure du nombre aléatoire retourné.</param>
        /// <param name="maxValue">Limite supérieure du nombre aléatoire retourné.</param>
        /// <returns></returns>
        public static int GenerateRandomValue(int minValue, int maxValue)
        {
            /// Nécessaire de faire +1 sur la valeur maximale car elle est exclue par la méthode <seealso cref="Random.Next(int, int)"/>.
            return new Random().Next(minValue, maxValue + 1);
        }
    }
}
