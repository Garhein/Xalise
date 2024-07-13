using System.Text.Json;

namespace Xalise.Web.Helpers
{
    public static class JsonHelper
    {
        public const string CSTS_FILENAME_EXT                   = "json";
        public const string CSTS_FILENAME_APPLICATION           = "ref-application";
        public const string CSTS_FILENAME_CLIENT                = "ref-client";
        public const string CSTS_FILENAME_PROJET                = "ref-projet";
        public const string CSTS_FILENAME_TYPE_DEVELOPPEMENT    = "ref-type-developpement";
        public const string CSTS_FILENAME_UTILISATEUR           = "ref-utilisateur";

        /// <summary>
        /// Construction du chemin d'accès à un fichier de données.
        /// </summary>
        /// <param name="filename">Nom du fichier.</param>
        /// <returns></returns>
        private static string ConstructEntityFilePath(string filename)
        {
            return Path.Combine($"{filename}.{JsonHelper.CSTS_FILENAME_EXT}");
        }

        /// <summary>
        /// Écriture d'un fichier d'entité.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="filename">Nom du fichier JSON, sans son extension.</param>
        /// <param name="objects">Objets à écrire dans le fichier JSON.</param>
        public static void WriteEntities<T>(string filename, IEnumerable<T> objects) where T : class
        {
            using (FileStream fs = File.Create(JsonHelper.ConstructEntityFilePath(filename)))
            {
                JsonSerializer.Serialize(fs, objects, new JsonSerializerOptions { WriteIndented = true });
            }
        }

        /// <summary>
        /// Lecture d'un fichier d'entité.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="filename">Nom du fichier JSON, sans son extension.</param>
        /// <returns></returns>
        public static List<T> ReadEntities<T>(string filename) where T : class
        {
            List<T> entities;

            using (FileStream fs = File.OpenRead(JsonHelper.ConstructEntityFilePath(filename)))
            {
                entities = JsonSerializer.Deserialize<List<T>>(fs) ?? new List<T>();
            }

            return entities;
        }
    }
}
