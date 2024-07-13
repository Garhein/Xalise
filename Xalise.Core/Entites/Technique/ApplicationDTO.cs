using System.ComponentModel.DataAnnotations;

namespace Xalise.Core.Entites.Technique
{
    [Serializable]
    public class ApplicationDTO
    {
        public int      Id { get; set; }

        [Required]
        [MaxLength(80)]
        public string   Nom { get; set; }

        /// <summary>
        /// Constructeur par défaut.
        /// </summary>
        public ApplicationDTO()
        {
            this.Id     = 0;
            this.Nom    = string.Empty;
        }
    }
}
